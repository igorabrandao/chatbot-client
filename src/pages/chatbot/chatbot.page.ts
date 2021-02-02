// Angular components
import { OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Custom services
import { BootService } from 'src/services/boot.service';

// Interfaces
import { Message } from 'src/interfaces/message';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.page.html',
    styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    msg: string;
    resultados: Message[]

    constructor(private chatBoot: BootService) {
        this.initBoot()
    }

    ngOnInit() {}

    initBoot() {
        this.resultados = []
        this.chatBoot.getResponse('oi')
            .subscribe((lista: any) => {
                lista.result.fulfillment.messages.forEach((element) => {
                    this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: lista.timestamp })
                });
            })
    }

    sendMessage() {
        this.resultados.push({ remetente: 'eu', mensagem: this.msg, data: new Date() })
        this.chatBoot.getResponse(this.removerAcentos(this.msg))
            .subscribe((lista: any) => {
                lista.result.fulfillment.messages.forEach((element) => {
                    this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: lista.timestamp })
                });
            })

        this.msg = '';
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    private removerAcentos(s) {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    }
}