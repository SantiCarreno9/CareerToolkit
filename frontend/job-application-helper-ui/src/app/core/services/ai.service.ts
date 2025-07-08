import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RequestResponse } from '../models/requestresponse';
import { catchError, map, Observable, of } from 'rxjs';
import { ExperienceEntry } from '../models/experience-entry';
import { AiResumeInstruction } from '../../resume/shared/models/ai-resume-instruction';

@Injectable({
  providedIn: 'root'
})
export class AiService
{

  private readonly baseUrl = environment.apiUrl + 'ai-resume';

  constructor(private http: HttpClient) { }

  tailorProfileEntry(instruction: AiResumeInstruction, experienceEntry: ExperienceEntry): Observable<RequestResponse<string[]>>
  {
    const body = {
      instruction: instruction,
      experienceEntry: experienceEntry
    };
    return this.http.post<string[]>(`${this.baseUrl}/tailor-experience-entry`, body, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<string[]>(res.status === 200, res.body, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

  tailorSummary(instruction: AiResumeInstruction, experienceEntries: ExperienceEntry[], currentSummary: string | null): Observable<RequestResponse<string>>
  {
    const body = {
      instruction: instruction,
      experienceEntries: experienceEntries,
      currentSummary: currentSummary
    };
    return this.http.post<string>(`${this.baseUrl}/tailor-summary`, body, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<string>(res.status === 200, res.body, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

  tailorSkills(instruction: AiResumeInstruction, experienceEntries: ExperienceEntry[], currentSkills: string | null): Observable<RequestResponse<string[]>>
  {
    const body = {
      instruction: instruction,
      experienceEntries: experienceEntries,
      currentSkills: currentSkills
    };
    return this.http.post<string[]>(`${this.baseUrl}/tailor-skills`, body, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<string[]>(res.status === 200, res.body, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

  tailorSection(instruction: AiResumeInstruction, sectionContent: string): Observable<RequestResponse<string>>
  {
    const body = {
      instruction: instruction,
      sectionContent: sectionContent
    };
    return this.http.post<string>(`${this.baseUrl}/tailor-section`, body, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<string>(res.status === 200, res.body, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

  selectExperienceEntries(instruction: AiResumeInstruction, experienceEntries: ExperienceEntry[]): Observable<RequestResponse<string[]>>
  {
    const body = {
      instruction: instruction,
      experienceEntries: experienceEntries
    };
    return this.http.post<string[]>(`${this.baseUrl}/select-experience-entries`, body, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<string[]>(res.status === 200, res.body, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

}
