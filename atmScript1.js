$(document).ready(function() {
    var usersDetailArr = [
        { 
            1234 : {
                "fname" : "John",
                "totalAmount" : 4000,
                "transactions" : [ {
                        "activity" : "Deposite",
                        "date"     :  "05/10/2021",     
                        "amt"      :  1000      
                    },
                    {
                        "activity" : "Withdraw",
                        "date"     :  "05/12/2021",   
                        "amt"      :  2000                 
                    },
                    {
                        "activity" : "Withdraw",
                        "date"     :  "05/15/2021",   
                        "amt"      :  500                 
                    }
                ]
            }
        },
        { 
            4567 : {
                "fname" : "Diana",
                "totalAmount" : 4000,
                "transactions" : [ {
                        "activity" : "Deposite",
                        "date"     :  "05/14/2021",     
                        "amt"      :  1000      
                    },
                    {
                        "activity" : "Withdraw",
                        "date"     :  "05/14/2021",   
                        "amt"      :  2000                 
                    }
                ]
            }
        },
    ];

    atmTransactions(usersDetailArr);

});

function atmTransactions(usersDetailArr) {
    console.log("inside function...");

    var keypadsHtml =   `<div style="display:flex;flex-wrap: wrap;width: 115px;margin: 6px 0px;padding: 7px;background: cornflowerblue;border: 2px solid blue;">
                            <div class="keyButtons">1</div>
                            <div class="keyButtons">2</div>
                            <div class="keyButtons">3</div>
                            <div class="keyButtons">4</div>
                            <div class="keyButtons">5</div>
                            <div class="keyButtons">6</div>
                            <div class="keyButtons">7</div>
                            <div class="keyButtons">8</div>
                            <div class="keyButtons">9</div>
                            <div class="keyButtons">0</div>
                            <div class="keyButtons clear">x</div>
                        </div>`;

    $(".pincodeKeypad").html(keypadsHtml);  

    $(".inputVal").val("");

    $(".keyButtons").on("click", pinButtonClicked);
    $(".inputBtn").on("click", goButtonCllicked);

    $(".clear").on("click", function() {
        $(".inputVal").val("");
    })

    function goButtonCllicked() {
        console.log("inside function ", usersDetailArr);
        var errorFlag = false;
        var inputVal = $(".inputVal").val();
        var userObject;

        validatePinInput();

        if (errorFlag)
            return;
        
        showDashboard();
        
        function validatePinInput() {

            if (inputVal == "") {
                $(".errorDiv").text("please enter Pincode");
                return errorFlag = true;
            }
            else 
            {
                for (var i=0; i<usersDetailArr.length; i++) {

                    if (usersDetailArr[i].hasOwnProperty(inputVal)) {

                        $(".userFname").text(usersDetailArr[i][inputVal].fname); 
                        userObject = usersDetailArr[i][inputVal];
                        return errorFlag = false;
                    }
                }  
                
                $(".errorDiv").text("Invalid Pincode Entered");
                return errorFlag = true;
            }
        } 

        function showDashboard() {
            console.log("in function showDashboard ", userObject);
            $(".inputVal").val("");

            $(".userDashboard").css("display", "block");
            $(".welcomeDIv").css("display", "none");
            $(".userActivity").on("click", clickedActivity);

            $(".userDashboard").on("click", ".keyButtons", pinButtonClicked);
            $(".userDashboard").on("click", ".clear", function() {
                $(".inputVal").val("");
            });

            $(".userDashboard").on("click", ".withSubmitBtn", widthDrawClicked);
            $(".userDashboard").on("click", ".depoAmtBtn", depositeClicked);
            $(".userDashboard").on("click", ".cancelBtn", cancelbtnClicked);

           //$(".cancelActivitys").on("click", canceledActivity);
           //$(".depoAmtBtn").on("click", depositeClicked);
            //
            //$(".amtClicked").on("click", amtClicked);
            //$(".transClicked").on("click", transClicked);

            // clickedActivity();
            // canceledActivity();

            function clickedActivity() {
                console.log("inside clicked activity ");

                $(".inputVal").val("");
                $("#bankBal").text("");
                $(".successmsg").css("display", "none");

                var dataval = "";
                
                $(".userActivity").css("background-color", "#4CAF50");
                $(this).css("background-color", "#653fc0");

                dataval = $(this).attr("data-action");
                var divId = "#" + dataval;

                $(".activityDiv").css("display", "none");
                $(divId).css("display", "block");

                switch(dataval) {
                    case "widthDrw" :
                        $(".Keypad").html(keypadsHtml);
                        break;
                    case "deposite" :
                        $(".Keypad").html(keypadsHtml);
                        break;
                    case "amt" :
                        $("#bankBal").text(userObject.totalAmount);
                        break;
                    case "trans" :
                        showTransactions();
                        break;
                }               
            }

            function cancelbtnClicked() {
                $(".activityDiv").css("display", "none");
            }

            function widthDrawClicked() {
                console.log("withdraw Submit button clicked ", inputVal);
                var valid = true;

                var withamt = parseInt($("#widthDrw #withAmt").val());

                validateWithAmt();

                if (!valid)
                     return;
                
                addTransactions(withamt, "Withdraw");
                userObject.totalAmount = userObject.totalAmount - withamt;

                console.log("userObject ", userObject);

                function validateWithAmt() {
                    if (withamt == "") {
                        $(".withErrorDiv").text("please enter amount to deposite");  
                        return valid = false;
                    }
                   
                    if (withamt > userObject.totalAmount) {
                        $(".withErrorDiv").text("Insufficient Balance.");  
                        return valid = false;
                    }

                } // end of the function
            }

            function depositeClicked() {
                console.log("deposite Submit button clicked ", inputVal);
                var valid = true;

                var depoamt = parseInt($("#deposite #depoAmt").val());

                validateWithAmt();

                if (!valid)
                     return;
                
                addTransactions(depoamt, "Deposite");
                userObject.totalAmount = userObject.totalAmount + depoamt;

                console.log("userObject ", userObject);

                function validateWithAmt() {

                    if (depoamt == "") {
                        $(".withErrorDiv").text("please enter amount to deposite");  
                        return valid = false;
                    }

                } // end of the function
            }

            function addTransactions(amount, activity) {
                console.log("inside withdraw process ",userObject);
               

                var newData =  {
                            "activity" : activity,
                            "date"     :  "05/15/2021",     
                            "amt"      :  amount      
                        }
                userObject.transactions.push(newData);
                $(".successmsg").css("display","block").text("Transaction is completed successfully.");    
                $(".cancelBtn").click();    

            }

            function showTransactions() {
                $("#trans").html("");

                var transHtml = `<div class="row transactions" style="background: #0d6efd;margin: 0px;">
                                    <div class="col" style="text-align: center;">Date</div>
                                    <div class="col" style="text-align: center;">Activity</div>
                                    <div class="col" style="text-align: center;">Amount</div>
                                </div>`;
                                
                var transArray = userObject.transactions;

                for (var i = 0; i < 10; i++ ) {

                    var divbackground = "#9edfaf";

                    if (i % 2 == 0) 
                        divbackground = "#cddfef"

                    transHtml += `<div class="row transactions" style="margin:0px;background:${divbackground}">
                                    <div class="col" style="text-align: center;">${transArray[i].date}</div>
                                    <div class="col" style="text-align: center;">${transArray[i].activity}</div>
                                    <div class="col" style="text-align: center;">${transArray[i].amt}</div>
                                </div>`;
                }

                $("#trans").append(transHtml);
            }
        }
    }

    function pinButtonClicked() {
        console.log("inside function pin Buttons");
        var inputtextVal = "";

        inputtextVal = $(".inputVal").val();

        inputtextVal += $(this).text();
        $(".inputVal").val(inputtextVal);

    }
}