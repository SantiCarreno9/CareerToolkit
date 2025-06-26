import { Component, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../../core/services/resume.service";
import { CoverLetter } from "../shared/models/cover-letter";

@Component({
    selector: 'app-cover-letter-template-base',
    imports: [CommonModule],
    template: ``
})
export abstract class CoverLetterTemplateBase implements OnInit
{
    protected resumeService = inject(ResumeService);
    // protected templateService = inject(ResumeTemplateService);

    @Input() coverLetter: CoverLetter = new CoverLetter();    

    constructor()
    {
        this.coverLetter.userInfo = {
            fullName: 'Santiago Felipe Carreño Pardo',
            address: '775 Midland Avenue, Scarborough ON, M1K 4E5',
            phoneNumber: '4376612248',
            email: 'santiago.carreno05@gmail.com'
        };
        this.coverLetter.organizationInfo = {
            recipientInfo: null,
            recipientName: null,
            organizationName: 'Affinity',
            organizationAddress: '4711 Yonge Street, Toronto, ON, M2N 6K8'
        }
        this.coverLetter.content = '<p>Dear&nbsp;BeyondTrust&nbsp;Hiring&nbsp;Team,</p><p></p><p>I&nbsp;am&nbsp;writing&nbsp;to&nbsp;express&nbsp;my&nbsp;keen&nbsp;interest&nbsp;in&nbsp;the&nbsp;Software&nbsp;Development&nbsp;Engineer&nbsp;position&nbsp;at&nbsp;BeyondTrust.&nbsp;With&nbsp;over&nbsp;three&nbsp;years&nbsp;of&nbsp;experience&nbsp;in&nbsp;delivering&nbsp;and&nbsp;supporting&nbsp;enterprise-ready&nbsp;cloud-based&nbsp;systems,&nbsp;I&nbsp;am&nbsp;confident&nbsp;that&nbsp;my&nbsp;skills&nbsp;and&nbsp;passion&nbsp;align&nbsp;perfectly&nbsp;with&nbsp;your&nbsp;requirements.&nbsp;My&nbsp;expertise&nbsp;in&nbsp;JavaScript&nbsp;frameworks&nbsp;like&nbsp;Angular,&nbsp;coupled&nbsp;with&nbsp;my&nbsp;proficiency&nbsp;in&nbsp;C#,&nbsp;API&nbsp;services,&nbsp;and&nbsp;microservices&nbsp;architectures,&nbsp;positions&nbsp;me&nbsp;to&nbsp;contribute&nbsp;significantly&nbsp;to&nbsp;your&nbsp;Identity&nbsp;Threat&nbsp;Detection&nbsp;and&nbsp;Response&nbsp;(ITDR)&nbsp;system.</p><p></p><p>My&nbsp;experience&nbsp;includes&nbsp;developing&nbsp;microservices-based&nbsp;web&nbsp;applications&nbsp;using&nbsp;.NET&nbsp;and&nbsp;Angular,&nbsp;implementing&nbsp;CI/CD&nbsp;pipelines&nbsp;with&nbsp;GitHub&nbsp;Actions,&nbsp;and&nbsp;deploying&nbsp;solutions&nbsp;to&nbsp;Azure&nbsp;using&nbsp;Docker&nbsp;and&nbsp;Kubernetes.&nbsp;As&nbsp;demonstrated&nbsp;by&nbsp;my&nbsp;work&nbsp;at&nbsp;Career&nbsp;Toolkit&nbsp;and&nbsp;Personal&nbsp;Finance&nbsp;App,&nbsp;I&nbsp;have&nbsp;a&nbsp;proven&nbsp;track&nbsp;record&nbsp;of&nbsp;building&nbsp;and&nbsp;deploying&nbsp;scalable,&nbsp;secure,&nbsp;and&nbsp;user-friendly&nbsp;applications.&nbsp;My&nbsp;hands-on&nbsp;experience&nbsp;with&nbsp;cloud&nbsp;providers&nbsp;like&nbsp;Azure&nbsp;and&nbsp;a&nbsp;strong&nbsp;understanding&nbsp;of&nbsp;the&nbsp;software&nbsp;development&nbsp;lifecycle&nbsp;(SDLC)&nbsp;make&nbsp;me&nbsp;well-prepared&nbsp;to&nbsp;tackle&nbsp;the&nbsp;challenges&nbsp;of&nbsp;this&nbsp;role.</p><p></p><p>I&nbsp;am&nbsp;particularly&nbsp;drawn&nbsp;to&nbsp;BeyondTrust&#39;s&nbsp;commitment&nbsp;to&nbsp;creating&nbsp;a&nbsp;safer&nbsp;world&nbsp;through&nbsp;cybersecurity&nbsp;SaaS.&nbsp;My&nbsp;passion&nbsp;for&nbsp;developing&nbsp;robust&nbsp;and&nbsp;secure&nbsp;solutions,&nbsp;combined&nbsp;with&nbsp;my&nbsp;dedication&nbsp;to&nbsp;continuous&nbsp;learning&nbsp;and&nbsp;growth,&nbsp;aligns&nbsp;perfectly&nbsp;with&nbsp;your&nbsp;values.&nbsp;I&nbsp;am&nbsp;excited&nbsp;about&nbsp;the&nbsp;opportunity&nbsp;to&nbsp;contribute&nbsp;to&nbsp;a&nbsp;team&nbsp;that&nbsp;values&nbsp;flexibility,&nbsp;trust,&nbsp;and&nbsp;continual&nbsp;learning,&nbsp;and&nbsp;I&nbsp;am&nbsp;confident&nbsp;that&nbsp;I&nbsp;can&nbsp;make&nbsp;a&nbsp;significant&nbsp;impact&nbsp;on&nbsp;your&nbsp;success.&nbsp;Thank&nbsp;you&nbsp;for&nbsp;considering&nbsp;my&nbsp;application.&nbsp;I&nbsp;look&nbsp;forward&nbsp;to&nbsp;the&nbsp;opportunity&nbsp;to&nbsp;discuss&nbsp;my&nbsp;qualifications&nbsp;further.</p><p></p><p>Sincerely,</p><p></p><p></p><p>Santiago Carreno</p>';
        // this.resumeInfo = {
        //     templateId: '1',
        //     sections: []
        // }
    }

    ngOnInit(): void
    {
        // if (this.resume.resumeInfo.sections.length === 0)
        // {
        //     this.defineBasicLayout();
        //     this.setUpDefaultLayout();
        //     return;
        // }
        // this.resumeInfo = {...this.resume.resumeInfo};
    }

    // protected getProfileEntriesIds(category: ProfileEntryCategory[]): string[]
    // {
    //     return this.resume.profileEntries.filter(pe => category.includes(pe.category)).map(pe => pe.id);
    // }

    // setUpDefaultLayout(): void
    // {
    //     const educationIndex = this.resumeInfo.sections.findIndex(s => s.title === BasicResumeSections.Education);
    //     if (educationIndex !== -1)
    //         this.resumeInfo.sections[educationIndex].entriesId = this.getProfileEntriesIds([ProfileEntryCategory.Education]);

    //     const experienceIndex = this.resumeInfo.sections.findIndex(s => s.title === BasicResumeSections.WorkExperience);
    //     if (experienceIndex !== -1)
    //         this.resumeInfo.sections[experienceIndex].entriesId = this.getProfileEntriesIds([ProfileEntryCategory.WorkExperience,ProfileEntryCategory.Project]);
    // }

    // defineBasicLayout(): void
    // {
    //     const templateInfo: ResumeTemplateInfo | null = this.templateService.getTemplateInfoById(this.resumeInfo.templateId);
    //     if (templateInfo !== null)
    //     {
    //         this.resumeInfo.sections = [...templateInfo.defaultSections];
    //         // this.resume.resumeInfo.sections = [...templateInfo.defaultSections];
    //     }
    // }
}