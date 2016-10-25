<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Mail;
use Config;
use Monitor;
use App\Models\SystemLog;
use App\Models\Server;
use App\Models\Service;
use App\Models\Webapp;
use App\Models\Delay;

class ScheduledMonitoring extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'monitor:scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $notifications = array();

            $servers = Server::where('watch', 1)->get();

            $start = microtime(true);
            foreach ($servers as $server) {
                $pingResult = Monitor::ping($server['ip']);
                if (!$pingResult['status']) {
                    $notifications[$server->supervisor_email][] =   array(
                        'type'  =>  'server',
                        'name'  =>  $server->hostname
                    );
                } else {
                    $services = Service::where('server', $server->id)->where('watch', 1)->get();
                    $webapps = Webapp::where('server', $server->id)->where('watch', 1)->get();

                    foreach ($services as $service) {
                        $result = Monitor::scanPort('tcp', $service->port, $server->ip);
                        if ($result['status'] == 'off') {
                            $notifications[$server->supervisor_email][] =   array(
                                'type'  =>  'service',
                                'name'  =>  $service->type
                            );
                        }
                    }

                    foreach ($webapps as $webapp) {
                        $result = Monitor::checkStatus($webapp->url);
                        if ($result['status'] == 'off') {
                            $notifications[$webapp->supervisor_email][] =   array(
                                'type'  =>  'webapp',
                                'name'  =>  $webapp->url
                            );
                        }
                    }
                }
            }
            $end = microtime(true);

            $delay = new Delay();
            $delay->category = 'scheduled';
            $delay->duration = number_format(($end-$start), 5);
            $delay->when = date("Y-m-d H:i:s");
            $delay->save();

            foreach ($notifications as $email => $off_events) {
                echo "<p>$email</p>";
                $body = '';
                foreach ($off_events as $item) {
                    switch ($item['type']) {
                        case 'server':
                            $body .= "<span style='color: red'>Server <strong>".$item['name']."</strong> is DOWN!</span><br>";
                            break;
                        case 'service':
                            $body .= "<span style='color: blue'>Service <strong>".$item['name']."</strong> is DOWN!</span><br>";
                            break;
                        case 'webapp':
                            $body .= "<span style='color: black'>Webapp <strong>".$item['name']."</strong> is DOWN!</span><br>";
                            break;
                    }
                }

                // Notify the admin about the new registration
                $data['body'] = $body;
                try {
                    Mail::send(['html' => 'emails.monitoring'], $data, function ($message) use ($email) {
                        $message->to($email)->subject('Monitoring report');
                    });
                } catch (Exception $ex) {
                    $log = new SystemLog();
                    $log->category = 'error';
                    $log->message = "Mail could not be sent! Error message: ".$ex->getMessage();
                    $log->when = date("Y-m-d H:i:s");
                    $log->save();
                }
            }
        } catch (Exception $ex) {
            $log = new SystemLog();
            $log->category = 'error';
            $log->message = "Mail could not be sent! Error message: ".$ex->getMessage();
            $log->when = date("Y-m-d H:i:s");
            $log->save();
        }
    }
}
