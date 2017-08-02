    $(document).ready(function(){
      var counter = 1; // Initial default defect counter
      var workDir, trainingPath, resultDir;
      $("#btnModalSave").on("click", function(){
        workDir = $("#txtWorkDir").val();
        trainingPath = $("#txtTrainingPath").val();
        resultDir = $("#txtResultDir").val();
        alert(workDir+  trainingPath+ resultDir);
        $('#modalSettings').modal('hide');
      });

      //Individual or Bulk upload changes
      $('input[type=radio][name=upload_type]').change(function() {
          $("#txtDefect").val("");
          $("#fileDefects").val("");
          if (this.value == 'individual') {
              $("#bulkContainer").hide();
              $("#individualContainer").show();
          }
          else {
              $("#individualContainer").hide();
              $("#bulkContainer").show();
          }
      });

      //Add a defect 
      $("#btnAddDefect").on('click', function(){
          debugger;
        var defect = $("#txtDefect").val();
        var defects =  $("#divDefects");
        var defects_contents = defect + "$$";
        defects.html(defects_contents); 
         $("#txtDefect").val("");
         var success_message = '<div class="alert alert-success" role="alert"><p class="contentFormat">Item ' + counter + ' Added</p></div>';
        $("#displayDefects").html(success_message);
        counter += 1;		
      });

      //Read from excel
      $("#btnDisplayResult").on('click', function(){
        var temp_table_data = '<table id="tblData" class="table table-bordered" border=1 style="margin-top:20px;">';
        var excel = new ActiveXObject("Excel.Application");
        var excel_file = excel.Workbooks.Open("D:/PC/Prediction/Classified_Result.xlsx");
        var excel_sheet = excel_file.Worksheets("Classified_Data");
        var excel_range = excel_sheet.UsedRange;
        var rowCount = excel_range.Rows.Count;
        var colCount = excel_range.Columns.Count;
        var table = document.getElementById("divtableData");
        
        temp_table_data += "<thead><tr><th>"+ excel_range.Cells(1,2).Value+"</th><th>"+ excel_range.Cells(1,3).Value +"</th><th>"+ excel_range.Cells(1,4).Value+"</th></tr></thead>";
        
        temp_table_data +="<tbody>";
        for(j=2;j<=rowCount; j++){
          temp_row_data = "<tr><td>"+ excel_range.Cells(j,2).Value+"</td><td>"+ excel_range.Cells(j,3).Value+"</td><td>"+ excel_range.Cells(j,4).Value+"</td></tr>"
          temp_table_data += temp_row_data;
        }
      });

      function writeToExcel(){
        var defects = $("#divDefects").text();
        var defectsArray = defects.split("$$")
        defectsArray.pop() // Remove the last element
        
        var excel = new ActiveXObject("Excel.Application");  
        
        var path = "file:\\\\D:\\PC\\Prediction\\temp.xlsx";
        var excel_file = excel.Workbooks.Open(path); 
        var excel_sheet = excel_file.Worksheets(1); 

        //Add Headers
        excel_sheet.Cells(1,1).Value = "Serial Number"; 
        excel_sheet.Cells(1,2).Value = "Defect Description"; 
        //Editing cells with defects
        for (var row = 2; row <8; row++) {
          excel_sheet.Cells(row,1).Value = "Defect-"+ (row-1); 
          excel_sheet.Cells(row,2).Value = "batch"; 
            };
        for (var row = 8; row <12; row++) {
          excel_sheet.Cells(row,1).Value = "Defect-"+ (row-1);
          excel_sheet.Cells(row,2).Value = "blkiso"; 
            };
        for (var row = 12; row <15; row++) {
          excel_sheet.Cells(row,1).Value = "Defect-"+ (row-1);
          excel_sheet.Cells(row,2).Value = "service"; 
            };		
        for (var row = 0; row <defectsArray.length; row++) {
          excel_sheet.Cells(row+2,1).Value = "Defect-"+ (row+1); 
          excel_sheet.Cells(row+2,2).Value = defectsArray[row]; 
        };
        counter = 1; //reseting the function
        //Save Excel    
        excel.ActiveWorkbook.Save();

        //showing excel are editing is done.
        
        excel_file.Close();
        
        //Clear the data
        $("#divDefects").text("");
      }

      $("#fileDefects").on('focus', function(){
        $("#divtableData").text("");
        return;

      });

      document.getElementById("btnClassify").addEventListener("click",function(e){
          var myBatFilePath = "C:\\Users\\siddaram.halli\\Desktop\\electron-quick-start-master\\sample.bat";
          const spawn = require('child_process').spawn;
          const bat = spawn('cmd.exe', ['/c', myBatFilePath]);
          bat.stdout.on('data', (data) => {
              var str = String.fromCharCode.apply(null, data);
              addLog(data);
              console.info(str);
          });
          bat.stderr.on('data', (data) => {
              var str = String.fromCharCode.apply(null, data);
              addLog(data,"error");
              console.error(str);
          });
          bat.on('exit', (code) => {
              console.log(`Child exited with code ${code}`);
          });
      },false);


    function addLog(message,type){
       console.log(message + " "+ type);
    }


  });
