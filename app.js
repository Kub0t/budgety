var budgetController = (function (){
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0 ) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1; 
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
        
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        
    };
    
    // data is an obejct consisting of 2 arrays each storing Expense or Income obejcts as array elements
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
        
    }
    
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
                        
            // create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // push it into data structure
            data.allItems[type].push(newItem);
            
            // Return new element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },        
        
        calculateBudget: function() {
            
            // calculate totals
            calculateTotal('inc');
            calculateTotal('exp');
            
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            } else {
                data.percentage = -1;
            }
            
        },
        
        calculatePercentages: function() {
            
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
            
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
        
        
        ,
        testing: function() {
            console.log(data);
        }
    }
    
})();




var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    }
    
    return {
        getinput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create HTML string with placeholder text
            
            if (type === 'inc') {   
            element = DOMstrings.incomeContainer;
                
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">          <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
            element = DOMstrings.expenseContainer;
            
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            
            
            // replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
           
            // insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        // we are passing the entire id
        // we need to find the parent as in JS we can only remove the child
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
                    
        },
        clearField: function () {
            var fields;
            var fieldsArr = [];
            /*fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
                                
            console.log(fields);
            
            var fieldsArr = Array.prototype.slice.call(fields);
            
            console.log(fieldsArr);*/
            
            fieldsArr = [document.querySelector(DOMstrings.inputDescription), document.querySelector(DOMstrings.inputValue)];
            
            
            
            fieldsArr.forEach(function (current) {
                current.value = "";
            });
            
                              
                            
        },
        displayBudget: function(obj) {
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%' ;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---' ;
            }  
            
        },     
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = `${percentages[index]} %`;
                } else {
                    current.textContent = '---';
                }
            });
        
        },
        formatNumber: function(num, type) {
            var numSplit, int, dec;
            
            num = Math.abs(num);  // absolute value
            num = num.toFixed(2);  
            
            numSplit = num.split('.')
            
            int = numSplit[0];
            if (int.length > 3) {
                int = `${int.substr(0, int.length - 3)} , ${int.substr(int.length - 3, int.length)}`;
            }
        }
        
        ,
        getDOMstrings: function() {
            return DOMstrings;
        }
        
    }
    
})();


var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
            
            if (event.keyCode === 13 || event.which === 13) {   // event.which for older browsers
                ctrlAddItem();
            }
    
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    
    
    };
    
    var updateBudget = function() {
        
        
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. return the budget
        var budget = budgetCtrl.getBudget();        
        
        // 5. display the budget (UI)
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        
        // 1. calc perc
        budgetCtrl.calculatePercentages();
        
        // 2. return perc
        var percentages = budgetCtrl.getPercentages();
        
        // 3. dispay the percs
        UIController.displayPercentages(percentages);
    }
    
    
    var ctrlAddItem = function() {
        var input, newItem;        
        
        // 1. get input
        input = UICtrl.getinput();
        
        if (input.description !== "" && !(isNaN(input.value)) && input.value > 0) {
        
            
            // 2. add item to bugdet contrl
            newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3. add the item to UI
            UICtrl.addListItem(newItem, input.type);

            // clear the fields
            UICtrl.clearField();

            // 5. calculate and update budget
            updateBudget();
            
            // 6. update percentages
            updatePercentages();
        }   
        
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // heavy relay on dom structure
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];      //inc
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. delete from UI
            UICtrl.deleteListItem(itemID);
            
            // 3. update and show new budget
            updateBudget();
            
            // 4. update percentages
            updatePercentages();
        }
    }
   
   
    return {
        init: function() {
            console.log('app started');
            setupEventListeners();
        }
    }
    
    
})(budgetController, UIController);

controller.init();



