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
    walletList: Wallet[];

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
        wallet_currency: '',
        amount_currency: ''
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
     * Function to clear the conversation data
     */
    clearConversationData() {
        this.conversationData = {
            email: '',
            passwd: '',
            amount: 0,
            from_currency: '',
            to_currency: '',
            wallet_currency: '',
            amount_currency: ''
        };
    }

    /**
     * Initialize the chatbot interaction
     */
    initBoot() {
        // Clear the message list
        this.messageList = [];

        // Clear the conversation data
        this.clearConversationData();

        // Set the default interaction type
        this.interactionType = 'message';

        // Try to retrieve the logged user
        if (this.auth.getUser() !== undefined && this.auth.getUser() !== null) {
            // Get the user object
            if (this.auth.getUser().data !== undefined) {
                this.userModel = this.auth.getUser().data;
            } else if (this.auth.getUser().result !== undefined) {
                this.userModel = this.auth.getUser().result;
            } else {
                this.userModel = this.auth.getUser();
            }

            // Sent the welcome message
            this.sendChatbotMessage("Welcome back, " + this.userModel.name);

            // Present the logged menu
            this.presentMenu();
        } else {
            // Initialize the user modal
            if (this.userModel == null || this.userModel == undefined) {
                this.userModel = { name: '', email: '', cpf: '', password: '', birth_date: '' };
            }

            // Clear the wallet list
            this.walletList = [];

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
                this.loginInputHandler(this.userMessage);
                break;
            case 'register':
                this.registerInputHandler(this.userMessage);
                break;
            case 'quotation':
                this.quotationInputHandler(this.userMessage);
                break;
            case 'setCurrency':
                this.setDefaultWalletInputHandler(this.userMessage);
                break;
            case 'deposit':
                this.depositInputHandler(this.userMessage);
                break;
            case 'withdraw':
                this.withdrawInputHandler(this.userMessage);
                break;
            case 'showBalance':
                this.showBalanceInputHandler(this.userMessage);
                break;
            default:
                if (this.userMessage !== undefined && this.userMessage != '') {
                    // Add the message to the list
                    this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

                    // Send the message to the server
                    this.chatBoot.sendMessage({ message: this.userMessage })
                        .then(data => {
                            if (data) {
                                // Handle the bot response
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
                // Set the interaction as a register input
                this.interactionType = 'register';
                this.registerInputHandler('');
            case 'setCurrency':
                // Set the interaction as the currency set
                this.interactionType = 'setCurrency';
                this.setDefaultWalletInputHandler('');
                break;
            case 'quotation':
                // Set the interaction as a quotation input
                this.interactionType = 'quotation';
                this.quotationInputHandler('');
                break;
            case 'deposit':
                // Set the interaction as a deposit input
                this.interactionType = 'deposit';
                this.depositInputHandler('');
                break;
            case 'withdraw':
                // Set the interaction as a withdraw input
                this.interactionType = 'withdraw';
                this.withdrawInputHandler('');
                break;
            case 'showBalance':
                // Set the interaction as a showBalance input
                this.interactionType = 'showBalance';
                this.showBalanceInputHandler('');
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
        if (message_ === undefined || message_ == '') {
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
        if (message_ === undefined || message_ == '') {
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
        if (message_ === undefined || message_ == '') {
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
     * Function to set the default wallet currency
     * 
     * @param message_ 
     */
    setDefaultWalletInputHandler(message_: string) {
        // Check the input context
        if (message_ === undefined || message_ == '') {
            // Request the quotation info
            this.sendChatbotMessage("Now, let's choose the currency ($$$)");
        } else {
            // Add the message to the list
            this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

            // Parse the input
            this.conversationData['wallet_currency'] = this.userMessage;

            // Clear the input
            this.userMessage = '';

            if (this.conversationData['wallet_currency'] != '') {
                // Try to set the default wallet
                this.setDefaultWallet();
            } else {
                // Repeat the input
                this.setDefaultWalletInputHandler('');
            }
        }
    }

    /**
     * Function to handle the deposit input
     * 
     * @param message_ 
     */
    depositInputHandler(message_: string) {
        // Check the input context
        if (message_ === undefined || message_ == '') {
            // Request the quotation info
            this.sendChatbotMessage(
                'To perform a deposit, use the following sintax: <br/><br/>' +
                '<strong><amount> <amount_currency> to <wallet_currency> wallet</strong>' +
                '<i><strong>e.g: 25 USD to USD wallet</strong></i>'
            );
        } else {
            // Add the message to the list
            this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

            // Clear the input
            this.userMessage = '';

            // Split the input
            let input = message_.split(' ');

            // Validate the input
            if (input.length == 5 && !isNaN(parseFloat(input[0])) && input[2] == 'to'
                && input[1].length < 5 && input[3].length < 5) {
                // Parse the input
                this.conversationData['amount'] = parseFloat(input[0]);
                this.conversationData['amount_currency'] = input[1];
                this.conversationData['wallet_currency'] = input[3];

                // Try to perform deposit the money
                this.depositMoney();
            } else {
                // Repeat the input
                this.depositInputHandler('');
            }
        }
    }

    /**
     * Function to handle the withdraw input
     * 
     * @param message_ 
     */
    withdrawInputHandler(message_: string) {
        // Check the input context
        if (message_ === undefined || message_ == '') {
            // Request the quotation info
            this.sendChatbotMessage(
                'To perform a money withdraw, use the following sintax: <br/><br/>' +
                '<strong><amount> <amount_currency> from <wallet_currency> wallet</strong>' +
                '<i><strong>e.g: 25 USD from USD wallet</strong></i>'
            );
        } else {
            // Add the message to the list
            this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

            // Clear the input
            this.userMessage = '';

            // Split the input
            let input = message_.split(' ');

            // Validate the input
            if (input.length == 5 && !isNaN(parseFloat(input[0])) && input[2] == 'to'
                && input[1].length < 5 && input[3].length < 5) {
                // Parse the input
                this.conversationData['amount'] = parseFloat(input[0]);
                this.conversationData['amount_currency'] = input[1];
                this.conversationData['wallet_currency'] = input[3];

                // Try to perform withdraw the money
                this.withdrawMoney();
            } else {
                // Repeat the input
                this.withdrawInputHandler('');
            }
        }
    }

    /**
     * Function to handle the show balance input
     * 
     * @param message_ 
     */
    showBalanceInputHandler(message_: string) {
        // Check the input context
        if (message_ === undefined || message_ == '') {
            // Request the quotation info
            this.sendChatbotMessage("Choose the wallet currency or type 'all' to see all wallets");
        } else {
            // Add the message to the list
            this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

            // Parse the input
            this.conversationData['wallet_currency'] = this.userMessage;

            // Clear the input
            this.userMessage = '';

            if (this.conversationData['wallet_currency'] != '') {
                // Try to get the wallet(s) balance
                this.showBalance();
            } else {
                // Repeat the input
                this.showBalanceInputHandler('');
            }
        }
    }

    // ***************************************************
    // ** Data handlers
    // ***************************************************

    /**
     * Function to perform login
     */
    doLogin() {
        this.sendChatbotMessage('Wait a second...');

        // Try to login
        this.userService.login({ email: this.conversationData['email'], password: this.conversationData['passwd'] })
            .then(result => {
                // Check the login status
                if (result !== null && result !== undefined) {
                    // Get the logged user
                    this.auth.setUser(result);

                    // Handle the bot response
                    this.sendChatbotMessage('Hey ' + result.name + '! It is good to have you onboard :)');

                    // Check if the user already have a default wallet
                    this.walletService.checkDefaultWallet({ user_id: result.id }).then(wallet => {
                        if (wallet !== null && wallet !== undefined) {
                            // Show the logged menu
                            this.presentLoggedMenu(result);
                        } else {
                            // Call the set default wallet
                            this.setDefaultWalletInputHandler('');
                        }
                    });
                } else {
                    // Handle the bot response
                    this.sendChatbotMessage('Oh sorry, I could not found your data, lets try again ;)');

                    // Clear the operation fields
                    this.conversationData['email'] = '';
                    this.conversationData['passwd'] = '';

                    // Repeat the input
                    this.loginInputHandler('');
                }
            });
    }

    /**
     * Function to perform login
     */
    registerUser() {
        this.sendChatbotMessage('Wait a second...');

        // Try to register the user
        this.userService.register({
            name: this.userModel.name, email: this.userModel.email, cpf: this.userModel.cpf,
            password: this.userModel.password, birth_date: this.userModel.birth_date
        })
            .then(result => {
                // Check the register status
                if (result !== null && result !== undefined) {
                    // Get the logged user
                    this.auth.setUser(result);

                    // Handle the bot response
                    this.sendChatbotMessage('Hey ' + result.name + '! It is good to have you onboard :)');

                    // Check if the user already have a default wallet
                    this.walletService.checkDefaultWallet({ user_id: result.id }).then(wallet => {
                        if (wallet !== null && wallet !== undefined) {
                            // Show the logged menu
                            this.presentLoggedMenu(result);
                        } else {
                            // Call the set default wallet
                            this.setDefaultWalletInputHandler('');
                        }
                    });
                } else {
                    // Handle the bot response
                    this.sendChatbotMessage('Oh sorry, I could not register you, lets try again ;)');

                    // Clear the current user data
                    this.userModel = { name: '', email: '', cpf: '', password: '', birth_date: '' };

                    // Repeat the input
                    this.registerInputHandler('');
                }
            });
    }

    /**
     * Function to perform currency conversion
     */
    convertCurrency() {
        this.sendChatbotMessage('Wait a second...');

        // Try to covnert currency
        this.transactionService.convertCurrency({
            from_currency: this.conversationData['from_currency'],
            to_currency: this.conversationData['to_currency'],
            amount: this.conversationData['amount']
        }).then(result => {
            // Check the conversion status
            if (result !== null && result !== undefined) {
                // Handle the bot response
                this.sendChatbotMessage(result.amount + ' ' + result.from_currency + " is equivalent to " +
                    result.converted_amount + ' ' + result.to_currency);

                setTimeout(() => {
                    // Show the logged menu
                    this.presentMenu();
                }, 2000);
            } else {
                // Handle the bot response
                this.sendChatbotMessage('Oh sorry, I could not convert the money, lets try again ;)');

                // Clear the operation fields
                this.conversationData['from_currency'] = '';
                this.conversationData['to_currency'] = '';
                this.conversationData['amount'] = '';

                // Repeat the input
                this.quotationInputHandler('');
            }
        });
    }

    /**
     * Function to set the default wallet
     */
    setDefaultWallet() {
        this.sendChatbotMessage('Wait a second...');

        // Try to covnert currency
        this.walletService.checkWallet({ user_id: this.userModel.id, currency: this.conversationData['wallet_currency'] })
            .then(wallet => {
                if (wallet !== null && wallet !== undefined && Object.keys(wallet).length > 0) {
                    // The wallet already exist, just set it as default
                    this.walletService.setDefaultWallet({ code: wallet.code })
                        .then(result => {
                            if (result) {
                                // Handle the bot response
                                this.sendChatbotMessage("The wallet " + wallet.currency + " was set as default ");

                                setTimeout(() => {
                                    // Show the logged menu
                                    this.presentMenu();
                                }, 2000);
                            } else {
                                // Handle the bot response
                                this.sendChatbotMessage('Could not set up the wallet, lets try again ;)');

                                // Clear the wallet fields
                                this.conversationData['wallet_currency'] = '';

                                // Repeat the input
                                this.setDefaultWalletInputHandler('');
                            }
                        });
                } else {
                    // The wallet do not exist, needs to created it
                    this.walletService.registerWallet({ user_id: this.userModel.id, currency: this.conversationData['wallet_currency'] })
                        .then(newWallet => {
                            if (newWallet !== null && newWallet !== undefined && Object.keys(newWallet).length > 0) {
                                // Handle the bot response
                                this.sendChatbotMessage("The wallet " + newWallet.currency + " was successfully created!");

                                setTimeout(() => {
                                    // Show the logged menu
                                    this.presentMenu();
                                }, 2000);
                            } else {
                                // Handle the bot response
                                this.sendChatbotMessage('Could not set up the wallet, lets try again ;)');

                                // Clear the wallet fields
                                this.conversationData['wallet_currency'] = '';

                                // Repeat the input
                                this.setDefaultWalletInputHandler('');
                            }
                        });
                }
            });
    }

    /**
     * Function to deposit money
     */
    depositMoney() {
        this.sendChatbotMessage('Wait a second...');

        // Try to deposit the money
        this.transactionService.depositMoney({
            user_id: this.userModel.id,
            amount_currency: this.conversationData['amount_currency'],
            wallet_currency: this.conversationData['wallet_currency'],
            amount: this.conversationData['amount']
        }).then(wallet => {
            // Check the wallet data
            if (wallet !== null && wallet !== undefined && Object.keys(wallet).length > 0) {
                // Handle the bot response
                this.sendChatbotMessage('You sent <strong>' + this.conversationData['amount'] + ' ' + this.conversationData['amount_currency'] +
                    "</strong> to the " + this.conversationData['wallet_currency'] + ' wallet. The new balance is: <strong>' + wallet.balance + '</strong>');

                setTimeout(() => {
                    // Show the logged menu
                    this.presentMenu();
                }, 2000);
            } else {
                // Handle the bot response
                this.sendChatbotMessage('Oh sorry, I could not send the money, lets try again ;)');

                // Clear the operation fields
                this.conversationData['amount_currency'] = '';
                this.conversationData['wallet_currency'] = '';
                this.conversationData['amount'] = '';

                // Repeat the input
                this.depositInputHandler('');
            }
        });
    }

    /**
     * Function to withdraw money
     */
    withdrawMoney() {
        this.sendChatbotMessage('Wait a second...');

        // Try to withdraw the money
        this.transactionService.withdrawMoney({
            user_id: this.userModel.id,
            amount_currency: this.conversationData['amount_currency'],
            wallet_currency: this.conversationData['wallet_currency'],
            amount: this.conversationData['amount']
        }).then(wallet => {
            // Check the wallet data
            if (wallet !== null && wallet !== undefined && Object.keys(wallet).length > 0) {
                // Handle the bot response
                this.sendChatbotMessage('you have withdrawn <strong>' + this.conversationData['amount'] + ' ' + this.conversationData['amount_currency'] +
                    "</strong> from the " + this.conversationData['wallet_currency'] + ' wallet. The new balance is: <strong>' + wallet.balance + '</strong>');

                setTimeout(() => {
                    // Show the logged menu
                    this.presentMenu();
                }, 2000);
            } else {
                // Handle the bot response
                this.sendChatbotMessage('Oh sorry, I could not get the money, lets try again ;)');

                // Clear the operation fields
                this.conversationData['amount_currency'] = '';
                this.conversationData['wallet_currency'] = '';
                this.conversationData['amount'] = '';

                // Repeat the input
                this.withdrawInputHandler('');
            }
        });
    }

    /**
     * Function to show the wallet balance
     */
    showBalance() {
        this.sendChatbotMessage('Wait a second...');

        // Try to withdraw the money
        this.transactionService.showWalletBalance({
            user_id: this.userModel.id,
            currency: this.conversationData['wallet_currency']
        }).then(data => {
            // Check the wallet data
            if (data !== null && data !== undefined && Object.keys(data).length > 0) {
                let wallets: any = [];
                let returnMessage: string = 'Below you can see your wallet(s) balance:<br/><br/>';

                if (data.length === undefined) {
                    wallets.push(data);
                } else {
                    wallets = data;
                }

                // Loop over the wallets
                wallets.forEach(wallet => {
                    returnMessage += 'Wallet <strong>' + wallet.currency + '</strong><br/>';
                    returnMessage += 'Code: ' + wallet.code + '<br/>';
                    returnMessage += 'Balance: ' + wallet.balance + '<br/>';
                    returnMessage += '<hr>';
                });

                // Handle the bot response
                this.sendChatbotMessage(returnMessage);

                setTimeout(() => {
                    // Show the logged menu
                    this.presentMenu();
                }, 2000);
            } else {
                // Handle the bot response
                this.sendChatbotMessage('Oh sorry, I could not get your wallet, lets try again ;)');

                // Clear the operation fields
                this.conversationData['wallet_currency'] = '';

                // Repeat the input
                this.showBalanceInputHandler('');
            }
        });
    }

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
        message = "Which option you'd like to pick? <br/><br/>";
        message += "-Deposit money into your wallet <br/>";
        message += "-Withdraw money <br/>";
        message += "-Show your wallet(s) balance <br/>";
        message += "-Set your default currency or create a new one <br/>";
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