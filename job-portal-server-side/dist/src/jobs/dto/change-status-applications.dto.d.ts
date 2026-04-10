export declare class ChangeStatusApplicationsDto {
    status: "waiting_interview" | "accepted" | "rejected";
    interview_date?: string;
    meeting_link?: string;
    notes?: string;
}
