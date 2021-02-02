// Angular components
import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { element } from 'protractor';

// Custom services
import { BootService } from '../../core/api/chatbot/chatbot.service';

// Interfaces
import { Message } from '../../core/interfaces/message';

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

    // User sender
    defaultSender: string = 'me';

    // User message
    userMessage: string;

    // Message list
    messageList: Message[];

    // ***************************************************
    // ** Class functions
    // ***************************************************

    /**
     * Class constructor
     * 
     * @param chatBoot 
     */
    constructor(private chatBoot: BootService) { }

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

        // Generate the welcome message
        this.chatBoot.generateWelcomeMessage()
            .then(data => {
                if (data) {
                    this.messageList.push({
                        sender: data.sender,
                        message: data.message,
                        date: new Date()
                    });
                }
            });
    }

    /**
     * Function to send a message
     */
    sendMessage() {
        if (this.userMessage !== undefined && this.userMessage != '') {
            // Add the message to the list
            this.messageList.push({ sender: this.defaultSender, message: this.userMessage, date: new Date() });

            // Send the message to the server
            this.chatBoot.sendMessage({ message: this.userMessage })
                .then(data => {
                    if (data) {
                        this.messageList.push({
                            sender: data.sender,
                            message: data.message,
                            date: new Date()
                        });
                    }
                });

            // Clear the input
            this.userMessage = '';
        }
    }
}
