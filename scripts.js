(function () {
    'use strict';

    var
        input,
        inputContainer,
        modalContainer,
        modalTrigger,
        modalClose,
        classSuccess = 'has-success',
        classError = 'has-error',
        modal = {
            /**
             * Init
             */
            init: function () {
                this.cacheDom();
                this.bindEvents();
            },

            /**
             * Cache dom
             */
            cacheDom: function () {
                this.modal = document.getElementById('product-modal');
                this.modalTrigger = document.getElementById('modal-trigger');
                this.modalClose = document.getElementById('modal-close');
                this.modalOverlay = document.getElementById('modal-overlay');
            },

            /**
             * Bind events
             */
            bindEvents: function () {
                this.modalTrigger.onclick = this.toggleModal.bind(this, true);
                this.modalClose.onclick = this.toggleModal.bind(this, false);
                this.modalOverlay.onclick = this.toggleModal.bind(this, false);
            },

            /**
             * Toggle modal
             * @param visible - boolean
             */
            toggleModal: function (visible) {
                if (visible) {
                    this.modal.classList.add('visible');
                } else {
                    this.modal.classList.remove('visible');
                }
            }
        },
        formValidation = {
            /**
             * Init
             */
            init: function () {
                this.cacheDom();
                this.bindEvents();
            },

            /**
             * Cache dom
             */
            cacheDom: function () {
                this.fields = {
                    title: document.getElementById('title'),
                    brand: document.getElementById('brand'),
                    fuel: document.getElementById('fuel'),
                    mileage: document.getElementById('mileage'),
                    color: document.getElementById('color'),
                    year: document.getElementById('year'),
                    price: document.getElementById('price'),
                    currency: document.getElementById('currency'),
                    description: document.getElementById('description'),
                    damaged: document.getElementById('damaged'),
                };
                this.brandIndicator = document.getElementById('brand-indicator');
                this.colorIndicator = document.getElementById('color-indicator');
                this.detailsContainer = document.getElementById('details-container');
                this.submitBtn = document.getElementById('submitBtn');
            },

            /**
             * Bind events
             */
            bindEvents: function () {
                var i;
                this.submitBtn.onclick = this.runRules.bind(this);
                for (i in this.fields) {
                    if (this.fields.hasOwnProperty(i)) {
                        input = this.fields[i];
                        inputContainer = input.parentElement;
                        input.onfocus = this.runRules.bind(this);
                        if (input.name === 'brand') {
                            input.onchange = this.onBrandChange.bind(this);
                        }
                        if (input.name === 'color') {
                            input.onchange = this.onColorChange.bind(this);
                        }
                        if (input.name === 'mileage' || input.name === 'year' || input.name === 'price') {
                            input.oninput = this.onNumberChange.bind(this, input);
                        }
                        if (input.name === 'damaged') {
                            input.onchange = this.onCheckboxChange.bind(this);
                        }
                        inputContainer.onclick = this.resetErrors.bind(this, input);
                    }
                }
            },

            /**
             * Run rules
             * @param event
             * @returns {boolean}
             */
            runRules: function (event) {
                var target = event.target,
                    type = event.type;
                if (target === this.submitBtn) {
                    this.preventDefault(event);
                } else if (type === 'focus') {
                    this.resetClassList(target.parentElement);
                    this.resetErrors(target);
                    return false;
                }
                this.resetClassList();
                this.checkFields();
            },

            /**
             * Prevent default
             * @param event
             */
            preventDefault: function (event) {
                event.preventDefault();
            },

            /**
             * Check fields
             */
            checkFields: function () {
                var i,
                    validCount = 0,
                    regex = /[0-9]|\./;
                for (i in this.fields) {
                    if (this.fields.hasOwnProperty(i)) {
                        input = this.fields[i];
                        // Check if field is empty
                        if (input.value.length === 0) {
                            this.addClass(input, classError);
                        } else if ((i === 'mileage' || i === 'year' || i === 'price') && !regex.test(input.value)) {
                            this.addClass(input, classError);
                        } else {
                            this.addClass(input, classSuccess);
                            validCount += 1;
                        }
                    }
                }
                // If all fields are valid
                if (validCount === Object.keys(this.fields).length) {
                    this.submitForm();
                }
            },

            /**
             * On brand change handler
             * @param event
             */
            onBrandChange: function (event) {
                inputContainer = event.target.parentElement;
                if (event.target.value) {
                    inputContainer.classList.add('has-indicator');
                    this.brandIndicator.style.backgroundImage = 'url(images/logo/' + event.target.value + '.png)';
                } else {
                    inputContainer.classList.remove('has-indicator');
                }
            },

            /**
             * On color change handler
             * @param event
             */
            onColorChange: function (event) {
                inputContainer = event.target.parentElement;
                if (event.target.value) {
                    inputContainer.classList.add('has-indicator');
                    this.colorIndicator.style.backgroundColor = event.target.value;
                } else {
                    inputContainer.classList.remove('has-indicator');
                }
            },

            /**
             * On number change handler
             * @param input
             */
            onNumberChange: function (input) {
                var regex = /[0-9]|\./;
                if (input.value.length) {
                    if (regex.test(input.value)) {
                        input.value = input.value.replace(/[^0-9\.]/g, '');
                        this.resetClassList(input);
                        this.removeError(input);
                    } else {
                        this.addClass(input, classError);
                        this.renderError(input, 'You must enter an number');
                    }
                } else {
                    this.resetClassList(input);
                    this.removeError(input);
                }
            },

            /**
             * On checkbox change handler
             * @param event
             */
            onCheckboxChange: function (event) {
                if (event.target.checked) {
                    this.detailsContainer.style.display = 'block';
                    this.fields.details = document.getElementById('details');
                    this.bindEvents();
                } else {
                    this.detailsContainer.style.display = 'none';
                    delete this.fields.details;
                }
            },

            /**
             * Add class
             * @param input
             * @param clss
             */
            addClass: function (input, clss) {
                inputContainer = input.parentElement;
                inputContainer.classList.add(clss);
            },

            /**
             * Reset class
             * @param input
             */
            resetClassList: function (input) {
                var i;
                // If targeting specific input
                if (input) {
                    inputContainer = input.parentElement;
                    inputContainer.classList.remove(classError, classSuccess);
                    input.focus();
                } else {
                    for (i in this.fields) {
                        if (this.fields.hasOwnProperty(i)) {
                            // Remove classes from all fields
                            this.fields[i].parentElement.classList.remove(classError, classSuccess);
                        }
                    }
                }
            },

            /**
             * Select error messages
             * @param input
             */
            errorMessage: function (input) {
                var message;
                if (input === this.fields.title) {
                    message = 'Please enter the title of the annnouncement';
                } else if (input === this.fields.brand) {
                    message = 'Please select the brand';
                } else if (input === this.fields.fuel) {
                    message = 'Please select the type of fuel';
                } else if (input === this.fields.year) {
                    message = 'Please enter the manufacturing year';
                } else if (input === this.fields.price) {
                    message = 'Please enter the price';
                } else if (input === this.fields.description) {
                    message = 'Please enter the description';
                }
                this.renderError(input, message);
            },

            /**
             * Render error
             * @param input
             * @param message
             */
            renderError: function (input, message) {
                var html;
                inputContainer = input.parentElement;
                html = document.createElement('div');
                html.setAttribute('class', 'form-message');
                html.innerHTML = message;
                // If message element doesn't exist
                if (!inputContainer.getElementsByClassName('form-message')[0]) {
                    inputContainer.appendChild(html);
                }
            },

            /**
             * Remove error
             * @param input
             */
            removeError: function (input) {
              inputContainer = input.parentElement;
              var error = inputContainer.getElementsByClassName('form-message')[0];
              if (error) {
                  inputContainer.removeChild(error);
              }
            },

            /**
             * Reset errors
             * @param input
             */
            resetErrors: function (input) {
                inputContainer = input.parentElement;
                // If container contains error
                if (inputContainer.classList.contains(classError)) {
                    this.resetClassList(input);
                }
            },

            /**
             * Submit handler
             */
            submitForm: function () {
                alert('Form is valid!');
            }
        };

    modal.init();
    formValidation.init();

})();