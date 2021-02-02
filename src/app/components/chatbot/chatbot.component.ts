// Angular components
import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { element } from 'protractor';

// Custom services
import { AuthClientHelper } from '../../core/helpers/auth/auth-client.helper';
import { BootService } from '../../core/api/chatbot/chatbot.service';
import { TransactionService } from '../../core/api/transaction/transaction.service';
import { UserService } from '../../core/api/user/user.service';

// Interfaces
import { Message } from '../../core/interfaces/message';
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
    loggedUser: User;

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
    };

    // ***************************************************
    // ** Class functions
    // ***************************************************

    /**
     * Class constructor
     * 
     * @param chatBoot 
     * @param transactionService 
     * @param userService 
     * @param auth 
     */
    constructor(private chatBoot: BootService, private transactionService: TransactionService,
        private userService: UserService, private auth: AuthClientHelper) { }

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
        this.loggedUser = this.auth.getUser();

        if (this.loggedUser !== undefined && this.loggedUser !== null) {
            // Get the user object
            this.loggedUser = this.auth.getUser().data;

            // Sent the welcome message
            this.sendChatbotMessage("Welcome back, " + this.loggedUser.name);

            // Present the logged menu
            this.presentLoggedMenu(this.loggedUser);
        } else {
            // Generate the welcome message
            this.chatBoot.generateWelcomeMessage()
                .then(data => {
                    if (data) {
                        // Sent the welcome message
                        this.sendChatbotMessage(data.message);

                        // Present the guest menu
                        this.presentGuestMenu();
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
                this.sendChatbotMessage('Please, inform you email');
            } else if (this.conversationData['passwd'] === undefined || this.conversationData['passwd'] == '') {
                // Request the user email
                this.sendChatbotMessage('Now inform you password');
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
     * Function to perform login
     */
    doLogin() {
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
                        // Handle the bot responde
                        this.sendChatbotMessage('Oh sorry, I could not found your data, lets try again ;)');
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }


    // ***************************************************
    // ** Menu handlers
    // ***************************************************

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
