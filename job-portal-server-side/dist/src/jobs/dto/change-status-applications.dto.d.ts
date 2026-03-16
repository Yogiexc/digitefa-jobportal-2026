export declare class ChangeStatusApplicationsDto {
    status: "screening" | "interviewing" | "accepted" | "rejected";
    interview_date?: string;
    meeting_link?: string;
    notes?: string;
}
