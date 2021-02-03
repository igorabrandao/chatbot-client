// Angular components
import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { element } from 'protractor';

// Custom services
import { AuthClientHelper } from '../../core/helpers/auth/auth-client.helper';
import { BootService } from '../../core/api/chatbot/chatbot.service';
import { TransactionService } from '../../core/api/transaction/transaction.service';
import { WalletService } from '../../core/api/wallet/wallet.service';
import { UserService } from '../../core/api/user/user.service';

// Interfaces
import { Message } from '../../core/interfaces/message';
import { Wallet } from '../../core/interfaces/wallet';
import { User } from '../../core/interfaces/user';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy {

    // ***************************************************
    // ** Class attributes
    // ***************************************************

    // HTML elements
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    // Model attributes
    messageList: Message[];
    userModel: User;

    // User sender
    defaultSender: string = 'me';

    // User message
    userMessage: string;

    // Bot message interaction
    interactionType: string = 'message';

    // Communication data
    conversationData: any = {
        email: '',
        passwd: '',
        amount: 0,
        from_currency: '',
        to_currency: '',
        wallet_currency: ''
    };

    // ***************************************************
    // ** Class functions
    // ***************************************************

    /**
     * Class constructor     
     * 
     * @param chatBoot 
     * @param transactionService 
     * @param walletService 
     * @param userService 
     * @param auth 
     */
    constructor(private chatBoot: BootService, private transactionService: TransactionService,
        private walletService: WalletService, private userService: UserService, private auth: AuthClientHelper) { }

    /**
     * Handle the initial page actions (only once)
     */
    ngOnInit() {
        this.initBoot();
    }

    /**
     * Handle the page destroying
     */
    ngOnDestroy() { }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    // ***************************************************
    // ** Event handler functions
    // ***************************************************

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    // ***************************************************
    // ** Chatbot handler functions
    // ***************************************************

    /**
     * Initialize the chatbot interaction
     */
    initBoot() {
        // Clear the message list
        this.messageList = [];

        // Set the default interaction type
        this.interactionType = 'message';

        // Try to retrieve the logged user
        if (this.auth.getUser() !== undefined && this.auth.getUser() !== null) {
            // Get the user object
            this.userModel = this.auth.getUser().data;

            // Sent the welcome message
            this.sendChatbotMessage("Welcome back, " + this.userModel.name);

            // Present the logged menu
            this.presentMenu();
        } else {
            // Initialize the user modal
            if (this.userModel == null || this.userModel == undefined) {
                this.userModel = { name: '', email: '', cpf: '', password: '', birth_date: '' };
            }

            // Generate the welcome message
            this.chatBoot.generateWelcomeMessage()
                .then(data => {
                    if (data) {
                        // Sent the welcome message
                        this.sendChatbotMessage(data.message);

                        // Present the menu
                        this.presentMenu();
                    }
                });
        }
    }

    /**
     * Function to send an automatic chatbot message
     * 
     * @param message_ 
     */
    sendChatbotMessage(message_: string) {
        if (message_ !== undefined && message_ != '') {
            // Add the message to the list
            setTimeout(() => {
                this.messageList.push({ sender: 'boot', message: message_, date: new Date() });
            }, 500);
        }
    }

    /**
     * Function to send a message
     */
    sendMessage() {
        switch (this.interactionType) {
            case 'login':
                if (this.userMessage !== undefined && this.userMessage != '') {
                    this.loginInputHandler(this.userMessage);
                } else {
                    this.loginInputHandler('');
                }

                break;
            case 'register':
                if (this.userMessage !== undefined && this.userMessage != '') {
                    this.registerInputHandler(this.userMessage);
                } else {
                    this.registerInputHandler('');
                }

                break;
            case 'quotation':
                if (this.userMessage !== undefined && this.userMessage != '') {
                    this.quotationInputHandler(this.userMessage);
                } else {
                    this.quotationInputHandler('');
                }

                break;
            default:
                if (this.userMessage !== undefined && this.userMessage != '') {
                    // Add the message to the list
                    this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

                    // Send the message to the server
                    this.chatBoot.sendMessage({ message: this.userMessage })
                        .then(data => {
                            if (data) {
                                // Handle the bot responde
                                this.chatbotResponseHandler(data);
                            }
                        });

                    // Clear the input
                    this.userMessage = '';
                }
                break;
        }
    }

    /**
     * Function to handle custom interactions
     * 
     * @param data_ 
     */
    chatbotResponseHandler(data_: Message) {
        switch (data_.message) {
            case 'login':
                // Set the interaction as a login input
                this.interactionType = 'login';

                // Call the login handler
                this.loginInputHandler('');

                break;
            case 'logout':
                // Set the interaction as a login input
                this.interactionType = 'logout';

                // Perform logout
                this.auth.logout();

                // Send a user message
                this.sendChatbotMessage('You are being disconnected...');

                // Reinitialize the chat
                setTimeout(() => {
                    this.initBoot();
                }, 2500);

                break;
            case 'register':
                // Set the interaction as a login input
                this.interactionType = 'register';

                // Call the register handler
                this.registerInputHandler('');

                break;
            case 'setCurrency':
                    // Set the interaction as the currency set
                    this.interactionType = 'setCurrency';
    
                    // Call the set currency handler
                    this.setCurrencyInputHandler('');
    
                    break;
            case 'quotation':
                // Set the interaction as a login input
                this.interactionType = 'quotation';

                // Call the quotation handler
                this.quotationInputHandler('');

                break;
            default:
                // Set the interaction as a simple message
                this.interactionType = 'message';

                // Add the message to the list
                this.messageList.push({
                    sender: data_.sender,
                    message: data_.message,
                    date: new Date()
                });

                break;
        }
    }

    // ***************************************************
    // ** Specific input handlers
    // ***************************************************

    /**
     * Function to handle the login input
     * 
     * @param message_ 
     */
    loginInputHandler(message_: string) {
        // Check the input context
        if (message_ == '') {
            if (this.conversationData['email'] === undefined || this.conversationData['email'] == '') {
                // Request the user email
                this.sendChatbotMessage('Please, inform your email');
            } else if (this.conversationData['passwd'] === undefined || this.conversationData['passwd'] == '') {
                // Request the user password
                this.sendChatbotMessage('Now inform your password');
            }
        } else {
            if (this.conversationData['email'] === undefined || this.conversationData['email'] == '') {
                // Get the email
                this.conversationData['email'] = message_;

                // Add the message to the list
                this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });
            } else if (this.conversationData['passwd'] === undefined || this.conversationData['passwd'] == '') {
                // Get the pwassword
                this.conversationData['passwd'] = message_;

                // Add the message to the list
                this.messageList.push({ sender: this.defaultSender, message: '******', date: new Date() });
            }

            // Clear the input
            this.userMessage = '';

            // Check if other input need to be informed
            if (this.conversationData['email'] == '' || this.conversationData['passwd'] == '') {
                this.loginInputHandler('');
            } else {
                // Try to login
                this.doLogin();
            }
        }
    }

    /**
     * Function to handle the register input
     * 
     * @param message_ 
     */
    registerInputHandler(message_: string) {
        let currentField = '';

        // Check the input context
        if (message_ == '') {
            if (this.userModel.name === undefined || this.userModel.name == '') {
                this.sendChatbotMessage('Please, inform your name (required)');
            } else if (this.userModel.email === undefined || this.userModel.email == '') {
                this.sendChatbotMessage('Your email (required)');
            } else if (this.userModel.cpf === undefined || this.userModel.cpf == '') {
                this.sendChatbotMessage('Your CPF (required)');
                this.sendChatbotMessage('example: 999.999.999-99');
            } else if (this.userModel.password === undefined || this.userModel.password == '') {
                this.sendChatbotMessage('Your password (required)');
            } else if (this.userModel.birth_date === undefined || this.userModel.birth_date == '') {
                this.sendChatbotMessage('Finally, inform your birth date (required)');
                this.sendChatbotMessage('format: (mm-dd-YYYY)');
            }
        } else {
            if (this.userModel.name === undefined || this.userModel.name == '') {
                this.userModel.name = message_;
                currentField = 'name';
            } else if (this.userModel.email === undefined || this.userModel.email == '') {
                this.userModel.email = message_;
                currentField = 'email';
            } else if (this.userModel.cpf === undefined || this.userModel.cpf == '') {
                this.userModel.cpf = message_;
                currentField = 'cpf';
            } else if (this.userModel.password === undefined || this.userModel.password == '') {
                this.userModel.password = message_;
                currentField = 'password';
            } else if (this.userModel.birth_date === undefined || this.userModel.birth_date == '') {
                this.userModel.birth_date = message_;
                currentField = 'birth_date';
            }

            if (currentField != 'password') {
                // Add the message to the list
                this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });
            } else {
                // Add the message to the list
                this.messageList.push({ sender: this.defaultSender, message: '******', date: new Date() });
            }

            // Clear the input
            this.userMessage = '';

            // Check if other input need to be informed
            if (this.userModel.name == '' || this.userModel.email == '' || this.userModel.cpf == '' ||
                this.userModel.password == '' || this.userModel.birth_date == '') {
                this.registerInputHandler('');
            } else {
                // Try to register the user
                this.registerUser();
            }
        }
    }

    /**
     * Function to handle the quotation input
     * 
     * @param message_ 
     */
    quotationInputHandler(message_: string) {
        // Check the input context
        if (message_ == '') {
            // Request the quotation info
            this.sendChatbotMessage(
                'To perform an currency exchange, use the sintax: <br/><br/>' +
                '<i><strong>e.g: 25 USD to EUR</strong></i>'
            );
        } else {
            // Add the message to the list
            this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

            // Clear the input
            this.userMessage = '';

            // Split the input
            let input = message_.split(' ');

            // Validate the input
            if (input.length == 4 && !isNaN(parseFloat(input[0])) && input[2] == 'to'
                && input[1].length < 5 && input[3].length < 5) {
                // Parse the input
                this.conversationData['amount'] = parseFloat(input[0]);
                this.conversationData['from_currency'] = input[1];
                this.conversationData['to_currency'] = input[3];

                // Try to perform the currency conversion
                this.convertCurrency();
            } else {
                // Repeat the input
                this.quotationInputHandler('');
            }
        }
    }

    /**
     * Function to handle the set currency input
     * 
     * @param message_ 
     */
    setCurrencyInputHandler(message_: string) {
        /* TODO */
    }

    // ***************************************************
    // ** Data handlers
    // ***************************************************

    /**
     * Function to perform login
     */
    doLogin() {
        let errorMessage = 'Oh sorry, I could not found your data, lets try again ;)';

        try {
            // Request the user email
            this.sendChatbotMessage('Wait a second...');

            this.userService.login({ email: this.conversationData['email'], password: this.conversationData['passwd'] })
                .then(data => {
                    if (data) {
                        // Get the logged user
                        this.auth.setUser({ data });

                        // Handle the bot responde
                        this.sendChatbotMessage('Hey ' + data.name + '! It is good to have you onboard :)');

                        // TODO: Set the default currency

                        // Show the logged menu
                        this.presentLoggedMenu(data);

                    } else {
                        // Handle the bot response
                        this.sendChatbotMessage(errorMessage);

                        // Repeat the input
                        this.loginInputHandler('');
                    }
                }).catch(function (reason) {
                    // Handle the bot response
                    this.sendChatbotMessage(errorMessage);

                    // Repeat the input
                    this.loginInputHandler('');
                });
        } catch (error) {
            console.log(error);

            // Handle the bot response
            this.sendChatbotMessage(errorMessage);

            // Repeat the input
            this.loginInputHandler('');
        }
    }

    /**
     * Function to perform login
     */
    registerUser() {
        let errorMessage = 'Oh sorry, I could not register you, lets try again ;)';

        try {
            // Request the user email
            this.sendChatbotMessage('Wait a second...');

            this.userService.register({
                name: this.userModel.name,
                email: this.userModel.email,
                cpf: this.userModel.cpf,
                password: this.userModel.password,
                birth_date: this.userModel.birth_date
            }).then(data => {
                if (data) {
                    // Get the logged user
                    this.auth.setUser({ data });

                    // Handle the bot responde
                    this.sendChatbotMessage('Hey ' + data.name + '! It is good to have you onboard :)');

                    // Set the default currency
                    this.chatBoot.sendMessage({ message: 'setCurrency' })
                        .then(data => {
                            if (data) {
                                // Handle the bot responde
                                this.chatbotResponseHandler(data);
                            }
                        });

                    // Show the logged menu
                    this.presentLoggedMenu(data);

                } else {
                    // Handle the bot response
                    this.sendChatbotMessage(errorMessage);

                    // Repeat the input
                    this.registerInputHandler('');
                }
            }).catch(function (reason) {
                // Handle the bot response
                this.sendChatbotMessage(errorMessage);

                // Repeat the input
                this.registerInputHandler('');
            });
        } catch (error) {
            console.log(error);

            // Handle the bot response
            this.sendChatbotMessage(errorMessage);

            // Repeat the input
            this.registerInputHandler('');
        }
    }

    /**
     * Function to perform currency conversion
     */
    convertCurrency() {
        let errorMessage = 'Oh sorry, I could not convert the money, lets try again ;)';

        try {
            // Request the user email
            this.sendChatbotMessage('Wait a second...');

            this.transactionService.convertCurrency(
                {
                    from_currency: this.conversationData['from_currency'],
                    to_currency: this.conversationData['to_currency'],
                    amount: this.conversationData['amount']
                })
                .then(data => {
                    if (data) {
                        // Handle the bot responde
                        this.sendChatbotMessage(data.amount + ' ' + data.from_currency + " is equivalent to " +
                            data.converted_amount + ' ' + data.to_currency);

                        setTimeout(() => {
                            // Show the logged menu
                            this.presentMenu();
                        }, 2000);

                    } else {
                        // Handle the bot response
                        this.sendChatbotMessage(errorMessage);

                        // Repeat the input
                        this.quotationInputHandler('');
                    }
                }).catch(function (reason) {
                    // Handle the bot response
                    this.sendChatbotMessage(errorMessage);

                    // Repeat the input
                    this.quotationInputHandler('');
                });
        } catch (error) {
            console.log(error);

            // Handle the bot response
            this.sendChatbotMessage(errorMessage);

            // Repeat the input
            this.quotationInputHandler('');
        }
    }

    // TODO: Implement setDefault Wallet

    // TODO: Implement get Wallet

    // ***************************************************
    // ** Menu handlers
    // ***************************************************

    /**
     * Function to decide which menu present
     */
    presentMenu() {
        // Check the user session
        if (this.auth.getUser() !== undefined && this.auth.getUser() !== null) {
            // Present the logged menu
            this.presentLoggedMenu(this.userModel);
        } else {
            // Present the guest menu
            this.presentGuestMenu();
        }
    }

    /**
     * Function to show the logged menu
     * 
     * @param user_ 
     */
    presentLoggedMenu(user_: User) {
        let message: string = "";

        // Present the options
        if (user_) {
            message = user_.name + ", which option you'd like to pick? <br/><br/>";
        } else {
            message = "Which option you'd like to pick? <br/><br/>";
        }

        message += "-Deposit money into your account <br/>";
        message += "-Withdraw money <br/>";
        message += "-Show your account balance <br/>";
        message += "-Set your default currency <br/>";
        message += "-Get currency quotation <br/>";
        message += "-Logout";

        // Present the options
        this.sendChatbotMessage(message);

        // Set the interaction type
        this.interactionType = 'inputLoggedMenu';
    }

    /**
     * Function to show the guest menu
     */
    presentGuestMenu() {
        let message: string = "Which option you'd like to pick? <br/><br/>";
        message += "-Login <br/>";
        message += "-Register <br/>";
        message += "-Get currency quotation <br/>";

        // Present the options
        this.sendChatbotMessage(message);

        // Set the interaction type
        this.interactionType = 'inputGuestMenu';
    }
}