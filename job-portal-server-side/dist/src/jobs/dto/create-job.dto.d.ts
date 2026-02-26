import { JobCategory } from "./job-category.enum";
export declare class CreateJobDto {
    title: string;
    category: JobCategory;
    employment_type: "full_time" | "freelance" | "internship";
    work_type: "on_site" | "remote" | "hybrid";
    description: string;
    location: string;
    salary_type: 'monthly_based' | 'project_based';
    minimum_salary: number;
    maximum_salary: number;
    hide_salary: string;
    education_requirement: string;
    experience_requirement: string;
    skills_category: string;
    skills_requirement: Array<string>;
    benefits: Array<string>;
    status: 'active' | 'draft';
}
