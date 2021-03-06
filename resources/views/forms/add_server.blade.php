<div id="addServerDialog" class="modal fade" style="display: none">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Add a new server</h4>
            </div>
            <div class="modal-body">
                {{ Form::open(array('class'=>'form-horizontal','id'=>'add_server_form')) }}
                     
                    <div class="form-group">
                        <label for="domain" class="col-sm-5 control-label">Domain <mq>*</mq></label>
                        <div class="col-sm-4">
                          {{ Form::text('domain','',array('class'=>'form-control','disabled'=>true)) }}                            
                        </div>                                    
                    </div>   
                
                    <div class="form-group">
                        <label for="hostname" class="col-sm-5 control-label">Host name <mq>*</mq></label>
                        <div class="col-sm-3">
                          {{ Form::text('hostname','',array('class'=>'form-control')) }}              
                        </div>            
                    </div>                     
                
                    <div class="form-group">
                        <label for="ip" class="col-sm-5 control-label">IP <mq>*</mq></label>
                        <div class="col-sm-3">
                          {{ Form::text('ip','',array('class'=>'form-control')) }}              
                        </div>            
                    </div> 
                
                    <div class="form-group">
                        <label for="os" class="col-sm-5 control-label">Operating System <mq>*</mq></label>
                        <div class="col-sm-3">
                          {{ Form::text('os','',array('class'=>'form-control')) }}              
                        </div>            
                    </div> 

                    <div id='result_div' style='margin-top: 20px'></div>

                {{ Form::close() }}  
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="add_server_confirm_button" onclick="ajaxManager.addServerModalSubmit()">Save</button>
            </div>
        </div>
    </div>
</div>