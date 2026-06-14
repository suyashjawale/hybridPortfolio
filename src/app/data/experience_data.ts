import { organization } from "../interfaces/organization";

export const experience_data: organization[] = [
    {
        org_name: "Tata Consultancy Services",
        selectedInd : 0,
        joined_date: new Date("2021-01-21"),
        end_date: "Present",
        logo_name: "organization_logo/tcs_logo_4.60kb.svg",
        roles: [
            {
                role_name: "System Engineer",
                role_start: new Date("2024-01-21"),
                role_end: "Present",
                tag_line: "Migrating legacy portal systems to a modern tech stack.",
                projects: [
                    {
                        project_name: "Enhancements",
                        project_content: [
                            "Implementing new features for the newly migrated portal."
                        ],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                        video_link: ""
                    },
                    {
                        project_name: "Migration",
                        project_content: [
                            "Migrated a legacy e-learning portal to Angular 17 and Java 17.",
                            "Managed dual development across both the legacy and new systems before focusing entirely on the new portal."],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                        video_link: ""
                    },
                ]
            },
            {
                role_name: "Assistant System Engineer",
                role_start: new Date("2023-01-21"),
                role_end: new Date("2024-01-21"),
                tag_line: "I was allocated to an internal project at TCS, where I worked on the e-learning platform named iEvolve.",
                projects: [
                    {
                        project_name: "Enhancements",
                        project_content: [
                            "Developed new features for iEvolve, TCS’s internal e-learning portal.",
                            "Implemented enhancements for the admin panel, including building several key features from scratch to improve administrative workflows.",
                            "Primarily utilized AngularJS for frontend development and the Spring Framework for backend logic."
                        ],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                        video_link: ""
                    }
                ]
            },
            {
                role_name: "Developer",
                role_start: new Date("2022-01-21"),
                role_end: new Date("2023-01-21"),
                tag_line: "I was allocated to an internal project at TCS, where I worked on machine learning and AI Models.",
                projects: [
                    {
                        project_name: "Linkedin Mapping",
                        project_content: [
                            "Recommends the top 5 internal courses that are most similar to a given LinkedIn Learning course.",
                            "Following the success of the previous Recommendation Engine, I was tasked with this cross-platform mapping project.",
                            "The system takes a single LinkedIn course as input and identifies 5 similar internal courses.",
                            "Processed data for approximately 5k LinkedIn courses, including titles, descriptions, focus areas, sub-focus areas, geography, and language metadata.",
                            "Handled multi-language data, including content in Chinese, Mandarin, Japanese, and German.",
                            "Translated the foreign language data into English using an open-source Google Translate integration.",
                            "Developed a custom web utility featuring an auto-scroll JavaScript behavior; this allowed the browser to translate table data in real-time, which was then captured and stored in the database.",
                            "Utilized an ensemble approach by combining outputs from both FastText and Word2Vec algorithms to find the most accurate course matches."
                        ],
                        tech_stack: ["Python", "Word2Vec", "Sklearn", "Fast2Text"],
                        show: false,
                        video_link: ""
                    },
                    {
                        project_name: "Learning and Recommendation Engine",
                        project_content: [
                            "Recommends courses to users based on their learning history, tower, role, unit, geography, and other parameters.",
                            "My role was to design an algorithm to generate the top 10 similar courses for every individual course.",
                            "Data was available for 50k courses, including title, description, focus area, sub-focus area, geography, language, and other metadata.",
                            "Concatenated the data into strings, tokenized them into words, and fed them into a Word2Vec algorithm for training.",
                            "The algorithm generates a vector for each course. I then looped through all courses to create a comprehensive vector array.",
                            "Calculated Cosine Similarity between a specific course vector and all other vectors. This was performed using batch processing to manage high RAM/memory intensity.",
                            "Designed a custom batch processing technique to handle the multi-dimensional arrays efficiently.",
                            "Extracted the top 10 most similar vectors (courses) and pushed the resulting data into the database.",
                            "Completed the core algorithm phase; the project further utilizes stored procedures, ETL processes, and frontend SQL queries to deliver the final recommendations.",
                            "This project was huge success"
                        ],
                        tech_stack: ["Python", "Word2Vec", "Sklearn"],
                        show: false,
                        video_link: ""
                    }
                ]
            },
            {
                role_name: "Graduate Trainee",
                role_start: new Date("2021-01-21"),
                role_end: new Date("2022-01-21"),
                tag_line: "Joined TCS as a fresher and got selected for the TCS Ignite training program.",
                projects: [
                    {
                        project_name: "Attrition Analysis",
                        project_content: [
                            "Developed a Python-based Jupyter Notebook to predict employee attrition (whether an employee is likely to leave the company).",
                            "Evaluated various machine learning algorithms from the Scikit-Learn (sklearn) library to determine the best predictive model.",
                            "Implemented a Random Forest classifier, which yielded the highest accuracy by analyzing features such as experience, learning history, domain, age, and roles.",
                            "Utilized historical data from former employees, including their documented reasons for departure, to train the model.",
                            "Successfully navigated data constraints; while salary data was withheld due to privacy restrictions, the model remained effective using other key metrics.",
                            "While the project served as a proof-of-concept rather than a production-ready tool, it provided valuable insights into workforce analytics."],
                        tech_stack: ["Python", "Jupyter notebook", "Sklearn"],
                        show: false,
                        video_link: ""
                    },
                    {
                        project_name: "Weather and News App",
                        project_content: [
                            "This Python Flask web application provides a dashboard for real-time weather data and global news updates.",
                            "It features a search option with voice-based search capabilities for finding news and weather by city.",
                            "It provides a detailed 14-day forecast for the searched city, accompanied by a visual chart.",
                            "Google Maps Integration: Displays the exact location of the searched city on an interactive map.",
                            "Sentiment analysis is performed on news articles to classify them as positive, negative, or neutral."
                        ],
                        video_link: "https://www.youtube.com/watch?v=nfEB4iuAqVs",
                        tech_stack: ["Python", "HtML", "Jquery"],
                        show: false,
                    },
                    {
                        project_name: "Generatives",
                        project_content: [
                            "This project is all about creating complex, detailed design patterns.",
                            "I used a handful of algorithms like Fibonacci and Bézier curves to get the logic right.",
                            "The final designs were part Tata Taneira’s saree captures.",
                            "The animation above. That’s generative animation in action."
                        ],
                        tech_stack: ["Javascript", "HTML"],
                        show: false,
                        video_link: ""
                    },
                ]
            }
        ]
    }
];