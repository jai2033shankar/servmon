function GuiManagerClass(){
    
    this.clearServerList = function(){
        $('#server-list-table').empty();
        $('#services-list-table tbody').empty();
        $('#webapps-list-table tbody').empty();
        $('#databases-list-table tbody').empty();
        $('#webappInfoDialog select[name="server"] option').remove();
    }
    
    this.addServers = function(serverList){
        for(var i=0; i<serverList.length; i++){
            this.addServer(serverList[i]);
        }
        /*
        for (var key in serverList) {
            if (serverList.hasOwnProperty(key)) {
                this.addServer(serverList[key]);
            }
        }
        */
    };

    this.updateServers = function(serverList){
        for (var key in serverList) {
            if (serverList.hasOwnProperty(key)) {
                this.updateServer(serverList[key]);
            }
        }
    };

    this.addServer = function(serverInfo){
        var serverListTable = $('#server-list-table');
        if(serverInfo.status === 'on')
            statusImg = '/images/green.png';
        else
            statusImg = '/images/red.png';
        serverListTable.append("<tr onclick='ajaxManager.serverSelected("+serverInfo.id+")' id='server-"+serverInfo.id+"' class='server-list-row'><td><img src='"+statusImg+"'></td><td>"+serverInfo.hostname+"</td><td>"+serverInfo.domain_name+"</td><td>"+serverInfo.ip+"</td><td>"+serverInfo.os+"</td><td class='services'></td></tr>");

        var servicesCell = $('#server-'+serverInfo.id+' .services').first();     
        this.addServicesIcons(serverInfo.services,servicesCell);  
        
        // Add server option in relevant dropdowns
        $('#webappInfoDialog select[name="server"]').append("<option value='"+serverInfo.id+"'>"+serverInfo.hostname+"."+serverInfo.domain_name+"</option>");
        $('#serviceInfoDialog select[name="server"]').append("<option value='"+serverInfo.id+"'>"+serverInfo.hostname+"."+serverInfo.domain_name+"</option>");
        $('#databaseInfoDialog select[name="server"]').append("<option value='"+serverInfo.id+"'>"+serverInfo.hostname+"."+serverInfo.domain_name+"</option>");
    };

    this.loadServerInfo = function(serverInfo){         
        var target = $('#services-list-table tbody');        
        target.empty();
        this.addServices(serverInfo.services);        
        
        var target = $('#webapps-list-table tbody');        
        target.empty();
        this.addWebapps(serverInfo.webapps);             
        
        var target = $('#databases-list-table tbody');        
        target.empty();
        this.addDatabases(serverInfo.databases);                 
        
    }

    this.updateServer = function(serverInfo){
        // Get pointers to each row cell
        var col1 =  $('#server-'+serverInfo.id+' td:nth-child(1)');
        var col2 =  $('#server-'+serverInfo.id+' td:nth-child(2)');
        var col3 =  $('#server-'+serverInfo.id+' td:nth-child(3)');
        var col4 =  $('#server-'+serverInfo.id+' td:nth-child(4)');
        var col5 =  $('#server-'+serverInfo.id+' td:nth-child(5)');

        // Update status info
        if(serverInfo.status === 'on')
                statusImg = '/images/green.png'
            else
                statusImg = '/images/red.png';

        col1.empty().append("<img src='/servmon-ui"+statusImg+"'>");

        // Update text info
        col2.empty().append(serverInfo.dns);
        col3.empty().append(serverInfo.ip);
        col4.empty().append(serverInfo.os);

        // Update services
        col5.empty();        
        this.addServicesIcons(serverInfo.services,col5);    
    };

    this.deleteServer = function(hostname){
        $('#server-'+hostname).remove();
    };

    this.addServicesIcons = function(serviceList,targetCell){        
        for(var serviceKey in serviceList){    
            switch(serviceList[serviceKey]){
                case 'mysql':                            
                    targetCell.append("<img class='serviceImg' src='/images/mysql.png' title='mysql'>");
                    break;
                case 'apache':
                    targetCell.append("<img class='serviceImg' src='/images/apache.png' title='apache'>");
                    break;
                case 'tomcat':
                    targetCell.append("<img class='serviceImg' src='/images/tomcat.png' title='tomcat'>");
                    break;
                case 'glassfish':
                    targetCell.append("<img class='serviceImg' src='/images/glassfish.png' title='glassfish'>");
                    break;
                case 'virtuoso':
                    targetCell.append("<img class='serviceImg' src='/images/virtuoso.png' title='virtuoso'>");
                    break;
                case 'geoserver':                            
                    targetCell.append("<img class='serviceImg' src='/images/geoserver.png' title='geoserver'>");
                    break;
                case 'jetty':                            
                    targetCell.append("<img class='serviceImg' src='/images/jetty.png' title='jetty'>");
                    break;
                case 'mariadb':                            
                    targetCell.append("<img class='serviceImg' src='/images/mariadb.png' title='mariadb'>");
                    break;
                case 'postgres':                            
                    targetCell.append("<img class='serviceImg' src='/images/postgres.png' title='postgres'>");
                    break;
            }
        }
    };

    this.addServices = function(serviceList){
        for (var key in serviceList) {
            if (serviceList.hasOwnProperty(key)) {            
                this.addService(serviceList[key]);
            }
        }
    };

    this.addService = function(serviceInfo){

        var serviceListTable = $('#services-list-table tbody');
        if(serviceInfo.status === 'on')
            statusImg = "<img src='/images/green.png' title='on'>";
        else if(serviceInfo.status === 'off')
            statusImg = "<img src='/images/red.png' title='off'>";
        else 
            statusImg = "<img src='/images/gray.png' title='Undefined. Click on server!'>"; 
        if(serviceInfo.time != null){
            respTimeNumber = new Number(serviceInfo.time);
            respTime = respTimeNumber.toFixed(5);
        } else {
            respTime = '';
        }
        serviceIcon = this.getServiceIcon(serviceInfo);

        var rowId = "service-row-"+serviceInfo.id;
        serviceListTable.append("<tr id='"+rowId+"'><td>"+serviceIcon+"</td><td>"+ajaxManager.supported_service_types[serviceInfo.stype].title+"</td><td>"+serviceInfo.version+"</td><td>"+respTime+"</td><td>"+statusImg+"</td></tr>");    

    };

    this.getServiceIcon = function(serviceInfo){          
        serviceImgInfo = ajaxManager.supported_service_types[serviceInfo.stype];
        serviceIcon = "<img class='serviceImg' src='/images/"+serviceImgInfo.image+"' title='"+serviceImgInfo.title+"' class=\"service-type-img\" onclick='ajaxManager.editServiceIconClicked("+serviceInfo.id+")' onmouseover=\"this.src='/images/edit.png'\" onmouseout=\"this.src='/images/"+serviceImgInfo.image+"'\">";                
        return serviceIcon;
    };

    this.updateServices = function(serviceList){
        for (var key in serviceList) {
            if (serviceList.hasOwnProperty(key)) {            
                this.updateService(serviceList[key]);
            }
        }
    };

    this.updateService = function(serviceInfo){
        var rowId = "service-row-"+serviceInfo.id;

        // Get pointers to each row cell
        var col1 =  $('#'+rowId+' td:nth-child(1)');
        var col2 =  $('#'+rowId+' td:nth-child(2)');
        var col3 =  $('#'+rowId+' td:nth-child(3)');
        var col4 =  $('#'+rowId+' td:nth-child(4)');
        var col5 =  $('#'+rowId+' td:nth-child(5)');

        // Update status info
        if(serviceInfo.status === 'on')
            statusImg = "<img src='/images/green.png' title='on'>";
        else if(serviceInfo.status === 'off')
            statusImg = "<img src='/images/red.png' title='off'>";
        else 
            statusImg = "<img src='/images/gray.png' title='Undefined. Click on server!'>"; 
        
        if(serviceInfo.time != null){
            respTimeNumber = new Number(serviceInfo.time);
            respTime = respTimeNumber.toFixed(5);
        } else {
            respTime = '';
        }

        col5.empty().append(statusImg);
        col4.empty().append(respTime);

        // Update text info    
        col2.empty().append(ajaxManager.supported_service_types[serviceInfo.stype].title);
        col3.empty().append(serviceInfo.version);

        // Update services
        col1.empty();        
        col1.append(this.getServiceIcon(serviceInfo));   
    };

    this.deleteService = function(serviceInfo){
        var rowId = "service-"+serviceInfo.type+"-"+serviceInfo.version;
        $('#'+rowId).remove();
    };

    this.addDatabases = function(databaseList){
        for (var key in databaseList) {
            if (databaseList.hasOwnProperty(key)) {            
                this.addDatabase(databaseList[key]);
            }
        }
    };

    this.addDatabase = function(databaseInfo){
        var serviceListTable = $('#databases-list-table');
        typeImg = this.getDatabaseIcon(databaseInfo);
        if(databaseInfo.related_webapp == null){
            related_app = '';
        } else {
            related_app = databaseInfo.related_webapp_name;
        }
        var rowId = "db-row-"+databaseInfo.id;
        serviceListTable.append("<tr id='"+rowId+"'><td>"+typeImg+"</td><td>"+databaseInfo.dbname+"</td><td>"+related_app+"</td></tr>");    

    };

    this.getDatabaseIcon = function(databaseInfo){
        databaseImgInfo = ajaxManager.supported_database_types[databaseInfo.type];
        databaseIcon = "<img class='databaseImg' src='/images/"+databaseImgInfo.image+"' title='"+databaseImgInfo.title+"' class=\"service-type-img\" onclick='ajaxManager.editDatabaseIconClicked("+databaseInfo.id+")' onmouseover=\"this.src='/images/edit.png'\" onmouseout=\"this.src='/images/"+databaseImgInfo.image+"'\">";                
        return databaseIcon;
    };

    this.updateDatabases = function(databaseList){
        for (var key in databaseList) {
            if (databaseList.hasOwnProperty(key)) {            
                this.updateDatabase(databaseList[key]);
            }
        }
    };

    this.updateDatabase = function(databaseInfo){
        var rowId = "db-row-"+databaseInfo.id;

        // Get pointers to each row cell
        var col1 =  $('#'+rowId+' td:nth-child(1)');
        var col2 =  $('#'+rowId+' td:nth-child(2)');
        var col3 =  $('#'+rowId+' td:nth-child(3)');    

        // Update text info    
        col2.empty().append(databaseInfo.dbname);
        col3.empty().append(databaseInfo.related_webapp_name);

        // Update services
        col1.empty();
        col1.append(this.getDatabaseIcon(databaseInfo));   
    };

    this.deleteDatabase = function(databaseInfo){
        var rowId = "db-"+databaseInfo.dbname;
        $('#'+rowId).remove();
    };

    this.getWebappIcon = function(webappInfo){                        
        webappImgInfo = ajaxManager.supported_webapp_types[webappInfo.language];
        webappIcon = "<img class='webappImg' src='/images/"+webappImgInfo.image+"' title='"+webappImgInfo.title+"' class=\"service-type-img\" onclick='ajaxManager.editWebappIconClicked("+webappInfo.id+")' onmouseover=\"this.src='/images/edit.png'\" onmouseout=\"this.src='/images/"+webappImgInfo.image+"'\">";                
        return webappIcon;
    };

    this.addWebapps = function(webappList){
        for (var key in webappList) {
            if (webappList.hasOwnProperty(key)) {            
                this.addWebapp(webappList[key]);
            }
        }
    };

    this.addWebapp = function(webappInfo){
        var webappsListTable = $('#webapps-list-table tbody');
        typeImg = this.getWebappIcon(webappInfo);

        if(webappInfo.status === 'on')
            statusImg = "<img src='/images/green.png' title='on'>";
        else if(webappInfo.status === 'off')
            statusImg = "<img src='/images/red.png' title='off'>";
        else 
            statusImg = "<img src='/images/gray.png' title='Undefined. Click on server!'>";         
        if(webappInfo.time != null){
            respTimeNumber = new Number(webappInfo.time);
            respTime = respTimeNumber.toFixed(5);
        } else {
            respTime = '';
        }
        
        var rowId = "webapp-row-"+webappInfo.id;
                
        webappsListTable.append("<tr id='"+rowId+"'><td>"+typeImg+"</td><td><a href='"+webappInfo.url+"'>"+webappInfo.url+"</a></td><td>"+webappInfo.developer+"</td><td>"+respTime+"</td><td>"+statusImg+"</td></tr>");    

    };

    this.updateWebapps = function(webappList){
        for (var key in webappList) {
            if (webappList.hasOwnProperty(key)) {            
                this.updateWebapp(webappList[key]);
            }
        }
    };

    this.updateWebapp = function(webappInfo){
        var rowId = "webapp-row-"+webappInfo.id;

        // Get pointers to each row cell
        var col1 =  $('#'+rowId+' td:nth-child(1)');
        var col2 =  $('#'+rowId+' td:nth-child(2)');
        var col3 =  $('#'+rowId+' td:nth-child(3)');    
        var col4 =  $('#'+rowId+' td:nth-child(4)'); 
        var col5 =  $('#'+rowId+' td:nth-child(5)');

        // Update status info
        if(webappInfo.status === 'on')
            statusImg = "<img src='/images/green.png' title='on'>";
        else if(webappInfo.status === 'off')
            statusImg = "<img src='/images/red.png' title='off'>";
        else 
            statusImg = "<img src='/images/gray.png' title='Undefined. Click on server!'>";         
        if(webappInfo.time != null){
            respTimeNumber = new Number(webappInfo.time);
            respTime = respTimeNumber.toFixed(5);
        } else {
            respTime = '';
        }
        col4.empty().append(respTime);
        col5.empty().append(statusImg);

        // Update text info    
        col2.empty().append("<a href='"+webappInfo.url+"'>"+webappInfo.url+"</a>");
        col3.empty().append(webappInfo.developer);

        // Update services
        col1.empty();
        col1.append(this.getWebappIcon(webappInfo));   
    };

    this.deleteWebapp = function(webappInfo){
        var rowId = "webapp-"+webappInfo.dns;
        $('#'+rowId).remove();
    };
    
    this.changeServerListDomain = function(domainName){
        $('#server-list-domain').html("("+domainName+")");
    }
    
    this.manageDynamicIcons = function(action){
        switch(action){
            case 'domainSelected':
                //$('#addDomainButton').show();
                $('#deleteDomainButton').show();
                $('#addServerButton').show();
                $('#editServerButton').hide();
                $('#deleteServerButton').hide();
                break;
            case 'domainUnselected':
                //$('#addDomainButton').hide();
                $('#deleteDomainButton').hide();
                $('#addServerButton').hide();
                $('#editServerButton').hide();
                $('#deleteServerButton').hide();
                $('#server-list-table').empty();
                $('#server-list-standalone').empty();
                $('#services-list-table tbody').empty();
                $('#webapps-list-table tbody').empty();
                $('#databases-list-table tbody').empty();
                break;
            case 'serverUnselected':
                $('#editServerButton').hide();
                $('#deleteServerButton').hide();
                $('#serverStatusButton').hide();
                break;
            case 'serverSelected':
                $('#editServerButton').show();
                $('#deleteServerButton').show();
                $('#add-service-icon').show();
                $('#add-webapp-icon').show();
                $('#add-database-icon').show();
                $('#serverStatusButton').show();
                break;
        }
    }
    
    this.indicateServerLine = function(oldSelectedId,newSelectedId){
        if(oldSelectedId > 0){       
            $('#server-'+oldSelectedId).removeClass('selected-server-line');            
        } 
        $('#server-'+newSelectedId).addClass('selected-server-line');
    }
    
    this.reloadTree = function(treeData){
        // Locate the tree container
        $('#domain_tree')
            // Listen for events 
            .on('select_node.jstree', function (event, data) {                                             
                if(!data.node.state.disabled){
                    ajaxManager.domainSelected(data.node.text);                                        
                }                                                                                                           
            })
            .on('deselect_node.jstree', function (event, data) {
                ajaxManager.domainUnselected();                                    
            })
            // Create the tree instance
            .jstree({
                "core" : {
                    "multiple" : false,
                    "animation" : 0,
                    "data": treeData
                }
        });
    }
    
}

function AjaxManagerClass(){
    
    this.selectedServer = -1;
    this.domainServers = null;
    this.selectedDomain = '';
    this.webappList = {};
    this.myServersList = {};
    this.baseUrl = window.location.protocol + "//" + window.location.host + "/";
    this.supported_webapp_types = {};
    this.supported_service_types = {};
    this.supported_database_types = {};    
    
    
    // Helper functions    
    
    this.loadServerInfo = function(){
        
        $.ajax({
            url: this.baseUrl+"api/servers/"+this.selectedServer,
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function( json,textStatus,jqXHR ) {                                
                guiManager.loadServerInfo(json.data);
                guiManager.manageDynamicIcons('serverSelected');
                $('#loading-image').hide();
            },
            error: ajaxFailure
        });
        
    }
    
    this.loadDomainServers = function(fullDomainName){  
        
        var thisObject = this;
        
        $.ajax({
            url: this.baseUrl+"api/domains/"+fullDomainName+"/all_servers",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function( json,textStatus,jqXHR ) {
                thisObject.selectedDomain = fullDomainName;
                thisObject.domainServers = json.data;
                guiManager.changeServerListDomain(fullDomainName);
                guiManager.clearServerList();
                guiManager.addServers(json.data);
            },
            error: ajaxFailure
        });
                
    };
    
    // Used for page initialization 
    
    this.initializeHomePage = function(){        
        
        var eManager = this;
        
        $.ajax({
            url: this.baseUrl+"api/info/supported_types",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function( json,textStatus,jqXHR ) {  
                var services = json.data.service;
                var webapps = json.data.webapp;
                var databases = json.data.database;
                
                for(var j=0; j<services.length; j++){    
                    // Store service types for future reference
                    eManager.supported_service_types[services[j].codename] = {
                        codename: services[j].codename,
                        title:    services[j].title,
                        default_port: services[j].default_port,
                        image: services[j].image
                    };
                    // Initialize modals
                    if(j == 0){
                        $('#addServiceDialog select[name="stype"]').append("<option selected='selected'>"+services[j].codename+"</option>");
                    } else {
                        $('#addServiceDialog select[name="stype"]').append("<option>"+services[j].codename+"</option>");
                    } 
                    selectedOption = $('#addServiceDialog select[name="stype"] option:selected').text();
                    $('#addServiceDialog input[name="port"]').val(ajaxManager.supported_service_types[selectedOption].default_port);
                    
                    $('#serviceInfoDialog select[name="stype"]').append("<option>"+services[j].codename+"</option>");
                }
                for(var i=0; i<webapps.length; i++){                    
                    // Store webapp types for future reference
                    eManager.supported_webapp_types[webapps[i].codename] = {
                        codename: webapps[i].codename,
                        title:    webapps[i].title,
                        image: webapps[i].image
                    };
                    // Initialize some modals
                    if(i == 0){
                        $('#addWebappDialog select[name="language"]').append("<option selected='selected'>"+webapps[i].codename+"</option>");
                    } else {
                        $('#addWebappDialog select[name="language"]').append("<option>"+webapps[i].codename+"</option>");
                    } 
                    $('#webappInfoDialog select[name="language"]').append("<option>"+webapps[i].codename+"</option>");
                }
                for(var i=0; i<databases.length; i++){        
                    // Store database types for future reference
                    eManager.supported_database_types[databases[i].codename] = {
                        codename: databases[i].codename,
                        title:    databases[i].title,
                        image: databases[i].image
                    };
                    // Initialize some modals
                    if(i == 0){
                        $('#addDatabaseDialog select[name="type"]').append("<option selected='selected'>"+databases[i].codename+"</option>");
                    } else {
                        $('#addDatabaseDialog select[name="type"]').append("<option>"+databases[i].codename+"</option>");
                    }  
                    $('#databaseInfoDialog select[name="type"]').append("<option>"+databases[i].codename+"</option>");
                }
            },
            error: ajaxFailure
        });
                
        // Load the tree data
        $.ajax({
            url: this.baseUrl+'api/domains',
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function( json ) {
                guiManager.reloadTree(json.data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Tree loading failed!');                        
            }
        });
        
        $.ajax({
            url: this.baseUrl+"api/delegations?mode=my_servers",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function( json ) {                                
                for(var k=0; k<json.data.length; k++){
                    var server = json.data[k];
                    if(server.status == 'on'){
                        statusImg = 'green.png';
                    } else {
                        statusImg = 'red.png';
                    }
                    $('#server-list-table-standalone').append("<tr onclick='ajaxManager.serverSelected(\""+server.id+"\")' id='server-"+server.id+"' class='server-list-row'><td><img src='images/"+statusImg+"'></td><td>"+server.hostname+"</td><td>"+server.full_name+"</td><td>"+server.ip+"</td><td>"+server.os+"</td><td class='services'></td></tr>");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Delegated servers loading failed!!');                        
            }
        });
    }
    
    // User actions not related to modal windows
    
    this.login = function(){
        $('#loading-image').center().show();
        var postData = { 
            inputEmail: $('#inputEmail').val(),
            inputPassword: $('#inputPassword').val()
        };

        $.ajax({
            url: window.location.protocol + "//" + window.location.host+"/api/login",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data ) {                
                window.location = window.location.protocol + "//" + window.location.host+"/home";  
            },
            error: ajaxFailure
        });
    }
    
    this.logout = function(){
        $('#loading-image').center().show();
        $.ajax({
            url: window.location.protocol + "//" + window.location.host+"/api/auth/logout",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data ) {                
                window.location = window.location.protocol + "//" + window.location.host;
            },
            error: ajaxFailure
        });
    }
    
    this.domainSelected = function(fullDomainName){
        $('#loading-image').center().show();
        this.selectedDomain = fullDomainName;
        this.loadDomainServers(fullDomainName);
        guiManager.manageDynamicIcons('domainSelected');
        $('#loading-image').hide();
    }
    
    this.domainUnselected = function(){
        this.selectedDomain = '';
        guiManager.manageDynamicIcons('domainUnselected');
    }
    
    this.serverSelected = function(serverId){
        $('#loading-image').center().show();
        guiManager.indicateServerLine(this.selectedServer,serverId);        
        this.selectedServer = serverId;                
        this.loadServerInfo(serverId);
        $('#loading-image').hide();
    }
    
    this.loadWebappList = function(){
        
        var eManager = this;
        $.ajax({
            url: this.baseUrl+"api/webapps",
            type: 'GET',
            success: function( json,textStatus,jqXHR ) {                                
                if (json.data.length > 0 ){
                    $('#databaseInfoDialog select[name="related_webapp"]').append("<option value='-1'>Noone</option>");
                    for(var c=0; c<json.data.length; c++){                        
                        $('#databaseInfoDialog select[name="related_webapp"]').append("<option value='"+json.data[c].id+"'>"+json.data[c].url+"</option>");
                        //eManager.webappList[data[c].id] = data[c].url; 
                    }
                } else {
                    //eManager.webappList = {};
                    $('#databaseInfoDialog select[name="related_webapp"]').append("<option value='-1'>There is no web app under this domain!</option>");                    
                }                
            },
            error: ajaxFailure
        });
    }    
    
    this.loadMyServersList = function(){
        
        var eManager = this;
        $.ajax({
            url: this.baseUrl+"api/servers?mode=mine",
            type: 'GET',
            success: function( json,textStatus,jqXHR ) {                                
                $('#webappInfoDialog select[name="server"]').empty();
                if (json.data.length > 0 ){                    
                    //$('#webappInfoDialog select[name="server"]').append("<option value='-1'>Noone</option>");
                    //$('#serviceInfoDialog select[name="server"]').append("<option value='-1'>Noone</option>");
                    for(var c=0; c<json.data.length; c++){                        
                        $('#webappInfoDialog select[name="server"]').append("<option value='"+json.data[c].id+"'>"+json.data[c].hostname+'.'+json.data[c].domain_name+"</option>");
                        $('#serviceInfoDialog select[name="server"]').append("<option value='"+json.data[c].id+"'>"+json.data[c].hostname+'.'+json.data[c].domain_name+"</option>");                        
                        //eManager.webappList[data[c].id] = data[c].url; 
                    }
                } else {
                    //eManager.webappList = {};
                    $('#webappInfoDialog select[name="server"]').append("<option value='-1'>There is no web app under this domain!</option>");                    
                }                
            },
            error: ajaxFailure
        });
    }
    
    this.installationButtonClicked = function(){
        $('#loading-image').center().show();
        /* get some values from elements on the page: */
        var postData = { 
            url: $('#installation_form input[name="url"]').val(), 
            server: $('#installation_form input[name="server"]').val(), 
            dbname: $('#installation_form input[name="dbname"]').val(), 
            dbuser: $('#installation_form input[name="dbuser"]').val(),
            dbpwd: $('#installation_form input[name="dbpwd"]').val(),           
        };
        
        $.ajax({
            url : this.baseUrl+"install",
            type: "POST",            
            dataType : 'json',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success:function(data, textStatus, jqXHR){
                localStorage.setItem("success_toastr",jqXHR.statusText);
                window.location = window.location.protocol + "//" + window.location.host;
            },
            error: ajaxFailure
        });
    }
    
    // Modal window-related actions
    
    this.addDomainIconClicked = function(){
        $('#add_domain_form input[name="node_name"]').val('');
        $('#add_domain_form input[name="parent_domain"]').val(this.selectedDomain);
        $('#add_domain_form input[name="fake_domain"]').prop('checked',false);
        $('#addDomainDialog').modal();
    }
        
    this.addWebappIconClicked = function(){
        $serverName = $('#server-'+this.selectedServer+' td:nth-child(2)').text();
        $('#addWebappDialog input[name="server"]').val($serverName);
        $('#addWebappDialog').modal();
    }
        
    this.addServerIconClicked = function(){
        $('#add_server_form input[name="hostname"]').val('');
        $('#add_server_form input[name="ip"]').val('');
        $('#add_server_form input[name="os"]').val('');
        $('#add_server_form input[name="domain"]').val(this.selectedDomain);
        $('#addServerDialog').modal();
    }    
    
    this.addServiceIconClicked = function(){
        $serverName = $('#server-'+this.selectedServer+' td:nth-child(2)').text();
        $('#addServiceDialog input[name="server"]').val($serverName);
        $('#addServiceDialog').modal(); 
    }
        
    this.addDatabaseIconClicked = function(){
        $serverName = $('#server-'+this.selectedServer+' td:nth-child(2)').text();
        $('#addDatabaseDialog input[name="server"]').val($serverName);
        $('#addDatabaseDialog').modal(); 
    }        
    
    this.editServerIconClicked = function(){
        var serverLine = $('#server-'+this.selectedServer);
        var hostname = serverLine.find(':nth-child(2)').text();
        var domain_name = serverLine.find(':nth-child(3)').text();        
        $('#edit_server_form input[name="hostname"]').val(hostname);
        $('#edit_server_form input[name="ip"]').val(serverLine.find(':nth-child(4)').text());
        $('#edit_server_form input[name="os"]').val(serverLine.find(':nth-child(5)').text());
        $('#edit_server_form input[name="domain"]').val(domain_name);
        $('#editServerDialog').modal();
    }
   
    this.editServiceIconClicked = function(serviceId){
        $('#loading-image').center().show();
        this.loadMyServersList();        
        $.ajax({
            url: this.baseUrl+"api/services/"+serviceId,
            type: 'GET',
            success: function( json,textStatus,jqXHR ) {                
                $('#serviceInfoDialog input[name="serviceId"]').val(serviceId);                
                $('#serviceInfoDialog select[name="stype"]').val(json.data.stype);
                $('#serviceInfoDialog input[name="port"]').val(json.data.port);
                $('#serviceInfoDialog input[name="version"]').val(json.data.version);
                $('#loading-image').hide();
                $('#serviceInfoDialog').modal();
                $("#serviceInfoDialog select[name='server']").prop('disabled',false);
                $("#serviceInfoDialog select[name='server'] option[value='"+json.data.server+"']").prop('selected',true);
                $("#serviceInfoDialog select[name='server']").prop('disabled',true);
            },
            error: ajaxFailure
        });
    }
  
    this.editWebappIconClicked = function(webappId){   
        $('#loading-image').center().show();
        this.loadMyServersList();        
        $.ajax({
            url: this.baseUrl+"api/webapps/"+webappId,
            type: 'GET',
            success: function( json,textStatus,jqXHR ) {                
                $('#webappInfoDialog input[name="appId"]').val(webappId);
                $('#webappInfoDialog input[name="url"]').val(json.data.url);
                $('#webappInfoDialog select[name="language"]').val(json.data.language);
                $('#webappInfoDialog input[name="developer"]').val(json.data.developer);
                $('#webappInfoDialog input[name="contact"]').val(json.data.contact);
                $('#webappInfoDialog input[name="origServer"]').val(json.data.server);
                $('#loading-image').hide();
                $('#webappInfoDialog').modal();
                $("#webappInfoDialog select[name='server'] option[value='"+json.data.server+"']").prop('selected',true);
            },
            error: ajaxFailure
        });
    }
    
    this.editDatabaseIconClicked = function(databaseId){
        $('#loading-image').center().show();
        $('#databaseInfoDialog select[name="related_webapp"]').empty();
        
        var eManager = this;
        
        // We need to load the list every time because someone else may have edited the webapps meanwhile
        this.loadWebappList();
        
        if(this.selectedDomain == ''){ // In case we work with an independently delegated server
            $('#databaseInfoDialog select[name="server"]').append("<option value='"+this.selectedServer+"'>You have not permission to change it!</option>");
            $('#databaseInfoDialog select[name="server"] option[value="'+this.selectedServer+'"]').attr('selected','selected');
        } else {
            // Get list of servers
            $.ajax({
                url: this.baseUrl+"api/domains/"+this.selectedDomain+"/servers",
                type: 'GET',
                async: false,
                success: function( json,textStatus,jqXHR ) {     
                        var dropdown = $('#databaseInfoDialog select[name="server"]');
                        dropdown.empty();
                        for(var c=0; c<json.data.length; c++){''                        
                            dropdown.append("<option value='"+json.data[c].id+"'>"+json.data[c].hostname+'.'+json.data[c].domain_name+"</option>");
                        }                       
                },
                error: ajaxFailure
            });
        }                
        
        // Get information about the database
        $.ajax({
            url: this.baseUrl+"api/databases/"+databaseId,
            type: 'GET',
            success: function( json,textStatus,jqXHR ) {                
                $('#databaseInfoDialog input[name="databaseId"]').val(databaseId);
                $('#databaseInfoDialog input[name="dbname"]').val(json.data.dbname);
                $('#databaseInfoDialog select[name="server"]').val(json.data.server);
                $('#databaseInfoDialog select[name="type"]').val(json.data.type);                
                $('#databaseInfoDialog input[name="origServer"]').val(json.data.server);
                $('#loading-image').hide();
                $('#databaseInfoDialog').modal();
                $("#databaseInfoDialog select[name='server']").val(ajaxManager.selectedServer);
                $('#databaseInfoDialog select[name="related_webapp"]').val(json.data.related_webapp);
            },
            error: ajaxFailure
        });
    }
       
    this.deleteServerIconClicked = function(){
        if(this.selectedServer != ""){
            $("#server_span_name").html($('#server-'+this.selectedServer+" td:nth-child(2)").text());
            $("#deleteServerForm input[name='delete_server_id']").val(this.selectedServer);
            $('#deleteServerDialog').modal('show');
        }  
    }
    
    this.deleteDomainIconClicked = function(){
        if(this.selectedDomain != ""){
            $("#domain_span_fullname").html(""+this.selectedDomain);
            $("#deleteDomainForm input[name='delete_domain_name']").val(this.selectedDomain);
            $('#deleteDomainDialog').modal('show');
        }  
    }
    
    this.selectWebappIconClicked = function(){
        $('#webapp-list-box').empty();
        $('#loading-image').show();
        
        $.ajax({
            url: this.baseUrl+'api/webapps',
            type: 'GET',
            async: false,
            success: function( json,textStatus,jqXHR ) {
                for(var j=0; j < json.data.length; j++){
                    $('#webapp-list-box').append('<li>'+json.data[j].url+'</li>');
                }
                add_webapp_selection_listener();
                $('#loading-image').hide();                
            },
            error: ajaxFailure
        });
        
        $('#webapp-list-div').show();
    }
    
    this.serverStatusIconClicked = function(){
        $serverName = $('#server-'+this.selectedServer+' td:nth-child(2)').text();
        $('#serverStatusRequestDialog input[name="server"]').val($serverName);
        $('#serverStatusRequestDialog').modal();
    }
    
    // Modal submisions - AJAX
    
    this.addDomainModalSubmit = function(){
        $('#loading-image').center().show();
        var fake = 0;
        if($('#add_domain_form input[name="fake_domain"]').is(':checked')){
            fake = 1;
        } else {
            fake = 0;
        }
        var postData = { 
            domains: [{
                node_name: $('#add_domain_form input[name="node_name"]').val(), 
                parent_domain: $('#add_domain_form input[name="parent_domain"]').val(),
                fake_domain: fake
            }]
        };

        $.ajax({
            url: this.baseUrl+"api/domains",
            type: 'POST',            
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#addDomainDialog').modal('hide');
                window.location.reload();
            },
            error: ajaxFailure
        });
        
    }
   
    this.addServerModalSubmit = function(){
        
        $('#loading-image').center().show();
        var postData = { 
            servers: [{
                domain: $('#add_server_form input[name="domain"]').val(), 
                hostname: $('#add_server_form input[name="hostname"]').val(), 
                ip: $('#add_server_form input[name="ip"]').val(), 
                os: $('#add_server_form input[name="os"]').val(),
            }]
        };

        $.ajax({
            url: this.baseUrl+"api/servers",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#addServerDialog').modal('hide');
                window.location.reload();
            },
            error: ajaxFailure
        });
    }
   
    this.addDatabaseModalSubmit = function(){
        
        $('#loading-image').center().show();
        var databaseInfo = {
            server: this.selectedServer,
            dbname: $('#addDatabaseDialog input[name="dbname"]').val(),
            type: $('#addDatabaseDialog select[name="type"]').val(),
        };
        var webapp = $('#addDatabaseDialog input[name="related_webapp"]').val();
        if(webapp.length > 0){
            databaseInfo['related_webapp'] = webapp;
        }
        var postData = { 
            databases: [databaseInfo]
        };
        
        var eManager = this;
        $.ajax({
            url: this.baseUrl+"api/databases",
            type: 'POST',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( json,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#addDatabaseDialog').modal('hide');
                toastr.success(jqXHR.statusText,{timeOut: 5000}); 
                guiManager.addDatabase(json.data[0]); 
            },
            error: ajaxFailure
        });
        
    }
    
    this.addWebappModalSubmit = function(){
        
        $('#loading-image').center().show();
        var postData = { 
            webapps: [{
                server: this.selectedServer,
                url: $('#addWebappDialog input[name="url"]').val(),
                language: $('#addWebappDialog select[name="language"]').val(),
                developer: $('#addWebappDialog input[name="developer"]').val(),
                contact: $('#addWebappDialog input[name="contact"]').val()                
            }]
        };
        
        var eManager = this;
        
        $.ajax({
            url: this.baseUrl+"/api/webapps",
            type: 'POST',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( json,textStatus,jqXHR ) {
                guiManager.addWebapp(json.data[0]);
                $('#loading-image').hide();
                $('#addWebappDialog').modal('hide');
                toastr.success(jqXHR.statusText,{timeOut: 5000}); 
            },
            error: ajaxFailure
        });
        
    }
    
    this.addServiceModalSubmit = function(){
        
        $('#loading-image').center().show();
        var postData = { 
            services: [{
                server: this.selectedServer,
                stype: $('#addServiceDialog select[name="stype"]').val(),
                port: $('#addServiceDialog input[name="port"]').val(),
                version: $('#addServiceDialog input[name="version"]').val()   
            }]
        };
        
        var eManager = this;
        
        $.ajax({
            url: this.baseUrl+"api/services",
            type: 'POST',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( json,textStatus,jqXHR ) {
                guiManager.addService(json.data[0]);
                $('#loading-image').hide();
                $('#addServiceDialog').modal('hide');
                toastr.success(jqXHR.statusText,{timeOut: 5000});                   
            },
            error: ajaxFailure
        });
        
    }
    
    this.editServerModalSubmit = function(){
        
        $('#loading-image').center().show();
        var postData = { 
            servers: [{
                serverId: this.selectedServer, 
                hostname: $('#edit_server_form input[name="hostname"]').val(), 
                ip: $('#edit_server_form input[name="ip"]').val(), 
                os: $('#edit_server_form input[name="os"]').val(),
            }]           
        };

        $.ajax({
            url: this.baseUrl+"api/servers",
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#editServerDialog').modal('hide');
                // Update server rows
                for(var k=0; k < data.length; k++){
                    $('#server-'+data[k].id+" td:nth-child(2)").text(data[k].hostname);
                    $('#server-'+data[k].id+" td:nth-child(4)").text(data[k].ip);
                    $('#server-'+data[k].id+" td:nth-child(5)").text(data[k].os);
                };
                $('#loading-image').hide();
                toastr.success('Server info updated!')
            },
            error: ajaxFailure
        });
    }
    
    this.editServiceModalSubmit = function(){
        $('#loading-image').center().show();
        var postData = { 
            services: [{
                id: $('#serviceInfoDialog input[name="serviceId"]').val(),
                stype: $('#serviceInfoDialog select[name="stype"]').val(),
                port: $('#serviceInfoDialog input[name="port"]').val(),
                version: $('#serviceInfoDialog input[name="version"]').val()
            }]
        };
        
        var eManager = this;
        $.ajax({
            url: this.baseUrl+"api/services",
            type: 'PUT',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( json,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#serviceInfoDialog').modal('hide');  
                guiManager.updateService(json.data[0]);
                toastr.success(jqXHR.statusText,{timeOut: 5000}); 
            },
            error: ajaxFailure
        });
    }
    
    this.editWebappModalSubmit = function(){
        
        $('#loading-image').center().show();
                       
        var postData = {
            webapps:[{
                id: $('#webappInfoDialog input[name="appId"]').val(),
                url: $('#webappInfoDialog input[name="url"]').val(),
                language: $('#webappInfoDialog select[name="language"]').val(),
                developer: $('#webappInfoDialog input[name="developer"]').val(),
                contact: $('#webappInfoDialog input[name="contact"]').val(),
                server: $('#webappInfoDialog select[name="server"]').val(),
            }]            
        };
        
        var eManager = this; 
        $.ajax({
            url: this.baseUrl+"api/webapps",
            type: 'PUT',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( json,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#webappInfoDialog').modal('hide');       
                var origServer = $('#webappInfoDialog input[name="origServer"]').val();
                var finalServer = $('#webappInfoDialog select[name="server"]').val();
                if(origServer != finalServer){
                    $('#webapp-row-'+appId).remove();
                } else {
                    guiManager.updateWebapp(json.data[0]);
                }
                toastr.success(jqXHR.statusText,{timeOut: 5000}); 
            },
            error: ajaxFailure
        });
        
    }
        
    this.editDatabaseModalSubmit = function(){
        
        $('#loading-image').center().show();
            
        var databaseInfo = {
            id: $('#databaseInfoDialog input[name="databaseId"]').val(),
            server: $('#databaseInfoDialog select[name="server"]').val(),
            dbname: $('#databaseInfoDialog input[name="dbname"]').val(),
            type: $('#databaseInfoDialog select[name="type"]').val(),
        };
        var webappId = $('#databaseInfoDialog select[name="related_webapp"]').val();
        if(webappId > 0){
            databaseInfo['related_webapp'] = webappId;
        }
        var postData = { 
            databases: [databaseInfo]
        };
        
        var eManager = this;
        
        $.ajax({
            url: this.baseUrl+"api/databases",
            type: 'PUT',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( json,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#databaseInfoDialog').modal('hide');     
                var origServer = $('#databaseInfoDialog input[name="origServer"]').val();
                var finalServer = $('#databaseInfoDialog select[name="server"]').val();
                if(origServer != finalServer){
                    $('#db-row-'+databaseInfo.id).remove();
                } else {
                    guiManager.updateDatabase(json.data[0]);                                    
                }
                toastr.success(jqXHR.statusText,{timeOut: 5000}); 
            },
            error: ajaxFailure
        });
        
    }
    
    this.deleteDomainModalSubmit = function(){
        
        $('#loading-image').center().show();
        
        var domainName = $('#deleteDomainForm input[name="delete_domain_name"]').val();
        
        $.ajax({
            url: this.baseUrl+"api/domains/"+domainName,
            type: 'DELETE',
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#deleteDomainDialog').modal('hide');                
                window.location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#deleteDomainDialog').modal('hide');
                $('#loading-image').hide();
                response = JSON.parse(jqXHR.responseText);
                var errorMessage = jqXHR.statusText+" ";
                for(var j=0; j < response.errors.length; j++){
                    errorItem = response.errors[j];
                    errorMessage = errorMessage+"<strong>"+errorItem.field+"</strong>: "+errorItem.message+"<br>";                    
                }
                toastr.error(errorMessage,{timeOut: 5000}); ; 
            }
        });
        
    }    
    
    this.deleteDatabaseModalSubmit = function(){
        
        $('#loading-image').center().show();
        
        var databaseId = $('#databaseInfoDialog input[name="databaseId"]').val();
        
        $.ajax({
            url: this.baseUrl+"api/databases/"+databaseId,
            type: 'DELETE',
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#databaseInfoDialog').modal('hide');                
                $('#db-row-'+databaseId).remove();
            },
            error: ajaxFailure
        });
        
    }
    
    this.deleteServerModalSubmit = function(){
        $('#loading-image').center().show();
        
        var serverId = $('#deleteServerForm input[name="delete_server_id"]').val();
        var eManager = this;
        
        $.ajax({
            url: this.baseUrl+"api/servers/"+serverId,
            type: 'DELETE',
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                eManager.selectedServer = '';
                $('#loading-image').hide();
                $('#deleteServerDialog').modal('hide');                
                $('#server-'+serverId).remove();
                $('#services-list-table tbody').empty();
                $('#webapps-list-table tbody').empty();
                $('#databases-list-table tbody').empty();
                
                if(eManager.selectedServer == serverId){
                    guiManager.manageDynamicIcons('serverUnselected');
                }                
                
                toastr.success(jqXHR.statusText,{timeOut: 5000});
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#deleteServerDialog').modal('hide');
                $('#loading-image').hide();
                response = JSON.parse(jqXHR.responseText);
                var errorMessage = jqXHR.statusText+" ";
                for(var j=0; j < response.errors.length; j++){
                    errorItem = response.errors[j];
                    errorMessage = errorMessage+"<strong>"+errorItem.field+"</strong>: "+errorItem.message+"<br>";                    
                }
                toastr.error(errorMessage,{timeOut: 5000});  
            }
        });
    }
    
    this.deleteServiceModalSubmit = function(){
        $('#loading-image').center().show();
        
        var appId = $('#serviceInfoDialog input[name="serviceId"]').val();
        
        $.ajax({
            url: this.baseUrl+"api/services/"+appId,
            type: 'DELETE',
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#serviceInfoDialog').modal('hide');                
                $('#service-row-'+appId).remove();
            },
            error: ajaxFailure
        });
    }
    
    this.deleteWebappModalSubmit = function(){
        
        $('#loading-image').center().show();
        
        var appId = $('#webappInfoDialog input[name="appId"]').val();
        
        $.ajax({
            url: this.baseUrl+"api/webapps/"+appId,
            type: 'DELETE',
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#loading-image').hide();
                $('#webappInfoDialog').modal('hide');                
                $('#webapp-row-'+appId).remove();                 
            },
            error: ajaxFailure
        });
        
    }
    
    this.serverStatusModalSubmit = function(){
           
        var postData;
        
        if($("#passwordAuth").is(':checked')){
            postData = { 
                authType: 'password',
                sshuser: $('#serverStatusRequestDialog input[name="sshuser"]').val(), 
                sshpass: $('#serverStatusRequestDialog input[name="sshpass"]').val(),
                sshport: $('#serverStatusRequestDialog input[name="sshport"]').val()
            };
        } else {
            postData = { 
                authType: 'rsa',
                sshuser: $('#serverStatusRequestDialog input[name="sshuser"]').val(),
                sshkey: $('#serverStatusRequestDialog input[name="sshkey"]').val(),
                sshport: $('#serverStatusRequestDialog input[name="sshport"]').val()
            };
        }                        
                
        $('#serverStatusRequestDialog').modal('hide');
        $('#loading-image').center().show();

        // Clear the SSH credentials from the HTML
        $('#serverStatusRequestDialog input[name="sshuser"]').val('');
        $('#serverStatusRequestDialog input[name="sshpass"]').val('');
        
        var eManager = this;

        $.ajax({
            url: this.baseUrl+"api/servers/"+this.selectedServer+"/snapshot",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            headers:{'X-CSRF-Token': $('#page_token').val()},
            success: function( data,textStatus,jqXHR ) {
                $('#loading-image').hide();                
                // In order to draw the Gauge elements we need the modal
                // to be in a 'shown' state. So, we wil start to put information
                // in the modal, after it has reached a 'shown' state.
                $('#serverStatusPanel').on('shown.bs.modal',{serverData: data},function(event){
                    eManager.fillServerStatusPanel(event.data.serverData);
                });
                $('#serverStatusPanel').modal('show'); 
            },
            error: ajaxFailure
        });
    }
    
    this.fillServerStatusPanel = function(data){
        console.log('DATA');
        console.log(data);
        // Uptime
        var uptimeData = data.uptime.split(" ");
        $('#uptime-holder').html("<span style='font-size: 26px; font-weight: bold'>"+uptimeData[0]+"</span>\n\
                                  <br>\n\
                                  <span>"+uptimeData[1]+"</span>");
        // Count processors
        $('#cpu-count-holder').empty();
        for(j=0; j<data.count_processors; j++){
            $('#cpu-count-holder').append("<img class='cpuImg' src='"+this.baseUrl+"/images/cpu.png'>");
        }                
        
        // Memory usage
        $('#total-memory-holder').html(data.total_memory_text);        
        var mem_usage = Math.round(100*(data.total_memory - data.free_memory)/data.total_memory);        
        $('#memory-usage-holder').css('width', mem_usage+'%').attr('aria-valuenow', mem_usage).html(mem_usage+'%'); 
        
        // Disk usage
        $('#disk-usage-holder').empty(); 
        for(j=0; j<data.df_blocks.length; j++){
            var newRow = "<tr><td>"+data.df_blocks[j].disk_name+"</td>\n\
                                <td>"+data.df_blocks[j].mount_point+"</td>\n\
                                <td>\n\
                                    <table style='width:100%'>\n\
                                        <tr>\n\
                                            <td>\n\
                                                <div class='progress'>\n\
                                                    <div style='width: "+data.df_blocks[j].usage+"%' class='progress-bar' role='progressbar' aria-valuenow='"+data.df_blocks[j].usage+"' aria-valuemin='0' aria-valuemax='100' style='min-width: 2em;'>\n\
                                                        "+data.df_blocks[j].usage+"%\n\
                                                    </div>\n\
                                                </div>\n\
                                            </td>\n\
                                        </tr>\n\
                                        <tr>\n\
                                            <td>\n\
                                                <div class='progress'>\n\
                                                    <div style='width: "+data.df_inodes[j].usage+"%' class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='"+data.df_inodes[j].usage+"' aria-valuemin='0' aria-valuemax='100' style='min-width: 2em;'>\n\
                                                        "+data.df_inodes[j].usage+"%\n\
                                                    </div>\n\
                                                </div>\n\
                                            </td>\n\
                                        </tr>\n\
                                    </table>\n\
                                </td>\n\
                            </tr>";
            $('#disk-usage-holder').append(newRow);
        }
        
        // List of network services
        $('#server-services-holder').empty();
        for(j=0; j<data.services.length; j++){
            var newRow = "<tr>\n\
                            <td>"+data.services[j].command+"</td>\n\
                            <td>"+data.services[j].user+"</td>\n\
                            <td>"+data.services[j].ipType+"</td>\n\
                            <td>"+data.services[j].protocol+"</td>\n\
                            <td>"+data.services[j].port+"</td>\n\
                            <td>"+data.services[j].address+"</td>\n\
                        </tr>";
                        
            $('#server-services-holder').append(newRow);
        }
        
        // CPU load
        load5minGauge(data.last5min_load,data.count_processors);
        load10minGauge(data.last10min_load,data.count_processors);
        
    }
    
}

    
    var guiManager = new GuiManagerClass();
    var ajaxManager = new AjaxManagerClass();
    

   
     