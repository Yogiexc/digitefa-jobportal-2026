export declare class ChangeStatusApplicationsDto {
    status: "screening" | "waiting_interview" | "interviewing" | "accepted" | "rejected";
    interview_date?: string;
    meeting_link?: string;
    notes?: string;
}
