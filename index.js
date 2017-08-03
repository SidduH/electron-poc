    $(document).ready(function(){
      var counter = 1; // Initial default defect counter
      var workDir = "", trainingPath = "", resultDir="";
      var defects_contents = "";
      var XLSX = require('xlsx');
      var Workbook = require('xlsx-workbook').Workbook;
        
      $("#btnModalSave").on("click", function(){
        workDir = $("#txtWorkDir").val();
        trainingPath = $("#txtTrainingPath").val();
        resultDir = $("#txtResultDir").val();
        //alert(workDir+  trainingPath+ resultDir);
        $('#modalSettings').modal('hide');
        if (workDir.endsWith('\\')){
          workDir = workDir.slice(0, -1);
        }
        if (resultDir.endsWith('\\')){
          resultDir = resultDir.slice(0, -1);
        }
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
        var defect = $("#txtDefect").val();
        if (!defect){
          return;
        }
        var defects =  $("#divDefects");
        defects_contents = defects_contents + defect + "$$";
        defects.html(defects_contents);
         $("#txtDefect").val("");
         var success_message = '<div class="alert alert-success" role="alert"><p class="contentFormat">Item ' + counter + ' Added</p></div>';
        $("#displayDefects").html(success_message);
        counter += 1;		
      });

      //Read from excel
      $("#btnDisplayResult").on('click', function(){
        workDir = workDir.split('\\').join('\\\\')
        var workbook = XLSX.readFile(workDir +'\\Classified_Result.xlsx');
        var sheet_name_list = workbook.SheetNames;
        //console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
        
        //var excel = new ActiveXObject("Excel.Application");
        //var excel_file = excel.Workbooks.Open("D:/PC/Prediction/Classified_Result.xlsx");
        sheet_name_list.forEach(function(y) {
          var worksheet = workbook.Sheets[y];
          var headers = {};
          var data = [];
          
          for(z in worksheet) {
              if(z[0] === '!') continue;
              //parse out the column, row, and value
              var col = z.substring(0,1);
              var row = parseInt(z.substring(1));
              var value = worksheet[z].v;

              //store header names
              if(row == 1) {
                  headers[col] = value;
                  continue;
              }

              if(!data[row]) data[row]={};
              data[row][headers[col]] = value;
          }
          console.log(headers);
          console.log(data);

          var table_structure = '<table id="tblData" class="table table-bordered" border=1>'
          
          var table_head = "<thead><tr>";
          for(header in headers){
            table_head += "<th>"+ headers[header]  +"</th>";
          }
          table_head += "</tr></thead>"


          var table_body = "<tbody>"
          for( datum in data){
            table_body += "<tr>";
            for(header in headers){
              table_body += "<td>"+ data[datum][headers[header]]  +"</td>";
            }
            table_body += "</tr>";
          }
          table_body += "</tbody>";
          var table = table_structure + table_head + table_body + "</table>";
          $("#divtableData").html(table);

        });
        // var excel_sheet = workbook.Sheets[sheet_name_list[0]];
        // var excel_range = excel_sheet.UsedRange;
        // var rowCount = excel_range.Rows.Count;
        // var colCount = excel_range.Columns.Count;
        // var table = document.getElementById("divtableData");
        // var temp_table_data = '<table id="tblData" class="table table-bordered" border=1 style="margin-top:20px;">';
        // temp_table_data += "<thead><tr><th>"+ excel_range.Cells(1,2).Value+"</th><th>"+ excel_range.Cells(1,3).Value +"</th><th>"+ excel_range.Cells(1,4).Value+"</th></tr></thead>";
        
        // temp_table_data +="<tbody>";
        // for(j=2;j<=rowCount; j++){
        //   temp_row_data = "<tr><td>"+ excel_range.Cells(j,2).Value+"</td><td>"+ excel_range.Cells(j,3).Value+"</td><td>"+ excel_range.Cells(j,4).Value+"</td></tr>"
        //   temp_table_data += temp_row_data;
        // }
      });

      function writeToExcel(){
        //export_table_to_excel('divtableData', 'xlsx', 'test');
        var defects = $("#divDefects").text();
        var defectsArray = defects.split("$$")
        defectsArray.pop() // Remove the last element
        
        var filename = "temp.xlsx";
        // the Workbook object gives you more control and stores multiple sheets 
        var workbook = new Workbook();
        
        var defects = workbook.add("Defects");
        
        defects[0][0] = "Serial Number"; 
		    defects[0][1] = "Defect Description"; 
        var row_number = 1;
        for(defect in defectsArray){
            defects[row_number][0] = "Defect " + defect+1;  
            defects[row_number][1] = defectsArray[defect];
            row_number += 1; // Increment 
        }
        
        // automatically appends the '.xlsx' extension 
        workbook.save(filename);
        var message = '<div class="alert alert-success" role="alert"><p>Successfully Saved the defects to "'+ filename+'"</p></div>'
        $("#displayDefects").html(message); // Clear the defects result
        //Clear the data
        $("#divDefects").text(""); // clear the defects entry
        
      }

      $("#fileDefects").on('focus', function(){
        $("#divtableData").text("");
      });

      document.getElementById("btnClassify").addEventListener("click",function(e){
        writeToExcel();
        if (workDir = ""){
          alert("Please add the work directory");
          return;
        }
        workDir = workDir.split('\\').join('\\\\');
        var myBatFilePath = workDir + "\\sample.bat";
        const spawn = require('child_process').spawn;
        const bat = spawn('cmd.exe', ['/c', myBatFilePath]);
        bat.stdout.on('data', (data) => {
            var str = String.fromCharCode.apply(null, data);
            console.info(str);
        });
        bat.stderr.on('data', (data) => {
            var str = String.fromCharCode.apply(null, data);
            console.error(str);
        });
        bat.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });
      },false);
  });
