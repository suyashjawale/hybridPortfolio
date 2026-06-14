import { organization } from "../interfaces/organization";

export const college_data: organization[] = [
    {
        org_name: "Savitribai Phule Pune University",
        selectedInd : 0,
        joined_date: new Date("2017-06-01"),
        end_date: new Date("2022-06-01"),
        logo_name: "organization_logo/sppu_logo15.5kb.webp",
        roles: [
            {
                role_name: "Masters In Computer Science",
                role_start: new Date("2020-06-01"),
                role_end: new Date("2022-06-01"),
                tag_line: " ",
                projects: [
                ]
            },
            {
                role_name: "Bachelor In Computer Science",
                role_start: new Date("2017-06-01"),
                role_end: new Date("2020-06-01"),
                tag_line: "Didn't get admission into Mechanical Engineering, so I opted for a 3-year CS degree and learned everything from the basics. Listing my projects and learning below.",
                projects: [
                    {
                        project_name: "Hypenotes",
                        project_content: [
                            "Hypenotes is an online e-learning platform designed for students and teachers.",
                            "Teachers can assign tasks and grade assignments directly within the platform.",
                            "Provides individual dashboards for both teachers and students to track progress.",
                            "Features a messaging system for teacher-student communication and a note-sharing system for students.",
                            "Includes a marksheet processing module that allows teachers to generate academic reports for each student."
                        ],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                        video_link: ""
                    },
                    {
                        project_name: "Learning Phase",
                        project_content: [
                            "Learned C, C++, Data Structures and Algorithms, HTML, CSS, JavaScript, PHP, Macros in C, Java, jQuery and a lot of other stuff."
                        ],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                        video_link: ""
                    }
                ]
            }
        ]
    }
];