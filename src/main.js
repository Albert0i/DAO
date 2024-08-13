let modulePath;

const condition = false; 

if (condition) {
    modulePath = './module1.js';
} else  {
    modulePath = './module2.js';
}

import(modulePath)
    .then(module => {
        if (condition) {
            module.functionInModule1();
        } else  {
            module.functionInModule2();
        } 
    })
    .catch(error => {
        console.error('Error loading the module', error);
    });