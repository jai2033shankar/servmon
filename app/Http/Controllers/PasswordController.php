<?php

namespace App\Http\Controllers;

use DB;
use Hash;
use Mail;
use Input;
use Validator;
use Redirect;
use DateTime;
use App\User;
use App\Models\PasswordResetLink;
use Illuminate\Http\Request;

/**
 * Implements functionality related to password reminding
 *
 * @license MIT
 * @author Alexandros Gougousis
 */
class PasswordController extends RootController {            
    
    /**
     * Sends to the user's email a password reset link
     * 
     * @param Request $request
     * @return Response
     */
    public function send_reset_link(Request $request){
        $form = $request->input();            
        $rules = config('validation.password_reset_request');
        $validation = Validator::make($form,$rules);

        if ($validation->fails()){
            $errors = [];
            foreach($validation->errors()->getMessages() as $key => $errorMessages){
                foreach($errorMessages as $msg){
                    $errors[] = array(
                        'field'     =>  $key,
                        'message'   =>  $msg
                    );
                }                    
            }
            return response()->json(['errors' => $errors])->setStatusCode(400, 'Monitoring parameters could not be validated!');
        } else {
            DB::beginTransaction();
            try {
                $user = User::where('email',$form['email'])->first();
                $uid = $user->id;
                
                 // Create and send a reset link
                $reset_link = new PasswordResetLink();
                $reset_link->uid = $uid;
                $random = str_random(24);
                $url = secure_url('password_reset/'.$random);
                $reset_link->code = $random;
                $date = new DateTime();
                $date->modify("+1 day");
                $valid_until = $date->format("Y-m-d H:i:s");
                $reset_link->valid_until = $valid_until;
                $reset_link->save();    
                
                // Notify the user about the reset link
                $data['link'] = $url;
                try {
                    Mail::send('emails.password_reset_link', $data, function($message) use ($user)
                    {
                      $message->to($user->email)->subject('ServMon: Password reset request');
                    });
                } catch (Exception $ex) {
                    DB::rollBack();
                    $this->log_event("Mail could not be sent! Error message: ".$ex->getMessage(),'error');
                    return response()->json(['errors' => []])->setStatusCode(500, 'Something went wrong! Please contact system administrator!'); 
                }            

                DB::commit();
                return response()->json([])->setStatusCode(200, 'A reset link was sent!');   
                
            } catch (Exception $ex) {
                DB::rollBack();
                $this->log_event("Request for reset link raised an error: ".$ex->getMessage(),'error');
                return response()->json(['errors' => []])->setStatusCode(500, 'Something went wrong! Please contact system administrator!');                
            }            
        }
    }               
    
    /**
     * Sets the user password to a new value selected by the user
     * 
     * @param string $code
     * @return Response
     */
    public function set_password($code){
        $linkInfo = PasswordResetLink::where('code','=',$code)->first();

        // Check for invalid link
        if(empty($linkInfo)){
            $this->log_event("Illegal reset link.",'authentication');
            return view('errors.illegal');
        }
        
        // Check for expired link
        $now = new DateTime();
        $valid_until = new DateTime($linkInfo->valid_until);
        if($now > $valid_until){
            $this->log_event("Expired reset link.",'authnetication');
            return response()->json(['errors' => $errors])->setStatusCode(400, 'Your reset link has expired!');
        } 
        
        // Validate new password
        $form = Input::all();            
        $rules = config('validation.password_reset');
        $validation = Validator::make($form,$rules);
        if ($validation->fails()){
            $errors = [];
            foreach($validation->errors()->getMessages() as $key => $errorMessages){
                foreach($errorMessages as $msg){
                    $errors[] = array(
                        'field'     =>  $key,
                        'message'   =>  $msg
                    );
                }                    
            }
            return response()->json(['errors' => $errors])->setStatusCode(400, 'Monitoring parameters could not be validated!');
        } 
        
        DB::beginTransaction();
        try {                                                
            $user = User::find($linkInfo->uid);
            $linkInfo->delete();                    
            $user->password = Hash::make($form['new_password']);  
            $user->save();                                                                         
        } catch (Exception $ex) {
            DB::rollBack();
            $this->log_event("Request for reset link raised an error: ".$ex->getMessage(),'error');
            return response()->json(['errors' => []])->setStatusCode(500, 'An unexpected error occured while trying to reset your password. Please contact system administrator!');                                    
        }       
        DB::commit();
        return response()->json([])->setStatusCode(200, 'Your password was reset successfully!');
    }
    
}