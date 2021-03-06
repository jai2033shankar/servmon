<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Domain;
use App\Models\Server;
use App\Models\Service;
use App\Models\Webapp;
use App\Models\Setting;
use App\Http\Controllers\RootController;
use Illuminate\Http\Request;
use App\Packages\Gougousis\Transformers\Transformer;

/**
 * Implements functionality related to item monitoring
 *
 * @license MIT
 * @author Alexandros Gougousis
 */
class MonitorController extends RootController
{
    protected $transformer;

    public function __construct()
    {
        $this->transformer = new Transformer('MonitorableServerTransformer');
    }

    /**
     * Returns a list with all the monitorable items
     *
     * @return Response
     */
    public function getMonitorable()
    {
        $response = array();
        $domains = Domain::all();
        foreach ($domains as $domain) {
            $server_list = array();
            $servers = Server::getByDomain($domain->id);
            foreach ($servers as $server) {
                $server->services = Service::getAllOnServer($server->id);
                $server->webapps = Webapp::getAllOnServer($server->id);
                $server_list[] = $server;
            }
            $transformedList = $this->transformer->transform($server_list);
            $response[$domain->full_name] = $transformedList['data'];
        }

        return response()->json(['data' => $response]);
    }

    /**
     * Updates monitoring configuration
     *
     * @return Response
     */
    public function changeStatus(Request $request)
    {
        $form = $request->input('config');

        // Form validation
        $errors = $this->loadValidationErrors('validation.config_monitor', $form, null, null);
        if (!empty($errors)) {
            return response()->json(['errors' => $errors])->setStatusCode(400, 'Monitoring parameters could not be validated!');
        }

        // Update status
        $status = Setting::find('monitoring_status');
        if (!empty($form['monitoring_status'])) {
            $status->value = 1;
        } else {
            $status->value = 0;
        }
        $status->save();

        // Update period
        $period = Setting::find('monitoring_period');
        $period->value = $form['monitoring_period'];
        $period->save();

        return response()->json([])->setStatusCode(200, 'Monitoring status updated!');
    }

    /**
     * Updates the monitoring status of every monitorable item
     *
     * @param Request $request
     * @return Response
     */
    public function updateConfiguration(Request $request)
    {
        $items = $request->input('items');
        $servers = array();
        $services = array();
        $webapps = array();
        foreach ($items as $checkboxName) {
            // The first part of the checkbox name contains the item type
            // and the second part the ID of the item
            $parts = explode('--', $checkboxName);
            if (count($parts) == 2) {
                switch ($parts[0]) {
                    case 'server':
                        $servers[] = $parts[1];
                        break;
                    case 'service':
                        $services[] = $parts[1];
                        break;
                    case 'webapp':
                        $webapps[] = $parts[1];
                        break;
                }
            }
        }

        // Update services
        DB::table('services')->update(['watch'=>0]);
        DB::table('services')->whereIn('id', $services)->update(['watch'=>1]);

        // Update servers
        DB::table('servers')->update(['watch'=>0]);
        DB::table('servers')->whereIn('id', $servers)->update(['watch'=>1]);

        // Update webapps
        DB::table('webapps')->update(['watch'=>0]);
        DB::table('webapps')->whereIn('id', $webapps)->update(['watch'=>1]);

        return response()->json([])->setStatusCode(200, 'Configuration updated!');
    }
}
