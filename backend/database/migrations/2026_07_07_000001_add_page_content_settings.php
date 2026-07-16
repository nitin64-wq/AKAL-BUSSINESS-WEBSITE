<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        $pageContent = [
            // ─── Home Page Section Content ───
            [
                'key' => 'section_why_abs_content',
                'value' => json_encode([
                    'title' => 'Why Future Leaders Choose ABS',
                    'subtitle' => 'The ABS Advantage',
                    'description' => 'We deliver a premium management education ecosystem, blending advanced technical analytics tools with strategic leadership paradigms.',
                    'features' => [
                        ['title' => '50% International Faculty', 'desc' => 'Learn directly from foreign professors and global business researchers.'],
                        ['title' => 'USA University MoUs', 'desc' => 'Academic pathways, summer schools, and student exchanges with top US institutes.'],
                        ['title' => 'AI & Business Analytics Core', 'desc' => 'Curriculum fully embedded with Power BI, Tableau, Python, SQL, and Machine Learning.'],
                        ['title' => 'Paid Corporate Internships', 'desc' => 'Gain hands-on corporate experience with stipends during the course of study.'],
                        ['title' => '100% Placement Assistance', 'desc' => 'Specialized corporate placement cell with consistent high-paying mock drills.'],
                        ['title' => 'Industry Certifications', 'desc' => 'Graduate with career-advancing professional certifications integrated in modules.'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Home: Why ABS Section Content',
            ],
            [
                'key' => 'section_impact_numbers_content',
                'value' => json_encode([
                    'title' => 'ABS By The Numbers',
                    'subtitle' => 'Impact & Statistics',
                    'description' => 'Proven record of academic success, high placements, and strong corporate tie-ups.',
                    'items' => [
                        ['label' => 'Highest Package', 'desc' => 'Top compensation package secured by our MBA Analytics candidates.'],
                        ['label' => 'Average Package', 'desc' => 'Mean annual compensation across placed MBA and BBA graduates.'],
                        ['label' => 'Alumni Network', 'desc' => 'ABS graduates leading analytics and commerce in Fortune 500 firms.'],
                        ['label' => 'Corporate Recruiters', 'desc' => 'Top analytics, consulting, and tech firms visiting our campus.'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Home: Impact Numbers Content',
            ],
            [
                'key' => 'section_campus_life_content',
                'value' => json_encode([
                    'title' => 'Vibrant Campus Life',
                    'subtitle' => 'ABS offers a holistic ecosystem that blends intense academics with active student engagement, sports, and cultural milestones.',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Home: Campus Life Section Header',
            ],
            [
                'key' => 'section_global_learning_content',
                'value' => json_encode([
                    'title' => 'Global Learning Ecosystem',
                    'subtitle' => 'International Partnerships',
                    'description' => 'ABS breaks geographic barriers. Through active collaborations with premier universities in the United States, our students gain exposure to international business paradigms and world-class researcher insights.',
                    'benefits' => [
                        'Academic credit transfers and semester abroad opportunities',
                        'Joint research publication pathways in Scopus/FT50 indexed journals',
                        'Interactive masterclasses led by distinguished international professors',
                        'Collaborative student capstones addressing global business analytics cases',
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Home: Global Learning Content',
            ],

            // ─── About Main Page ───
            [
                'key' => 'page_about_main',
                'value' => json_encode([
                    'hero_title' => 'About Akal Business School',
                    'hero_subtitle' => 'A globally benchmarked management education with a strong foundation in analytics, technology, and ethical leadership.',
                    'mba_title' => 'About the MBA in AI & Business Analytics',
                    'mba_para1' => 'The MBA in AI & Business Analytics at Akal Business School (ABS), Akal University, Talwandi Sabo is designed to deliver a globally benchmarked management education with a strong foundation in analytics, technology, and ethical leadership.',
                    'mba_para2' => 'The program operates under the stewardship of Prof. Gurpreet Dhillon, Dean, College of Business Administration, University of Nebraska, Omaha and the philanthropic vision of The Kalgidhar Trust, blending global academic standards with value-based education and societal impact.',
                    'mba_image' => '/storage/programs/about_img.png',
                    'global_mba_title' => 'A Global MBA Experience',
                    'global_mba_text' => 'Our MBA offers an American-style learning experience with 50% of the courses taught by foreign faculty, bringing international perspectives, case-based pedagogy, and global best practices into the classroom. Students receive the rigor and exposure of an international MBA at a fraction of the cost compared to leading Indian MBA programs.',
                    'curriculum_title' => 'State-of-the-Art Curriculum in AI & Business Analytics',
                    'curriculum_subtitle' => 'The program integrates management fundamentals with advanced analytics, ensuring graduates are industry-ready from day one.',
                    'curriculum_areas' => [
                        'Data Analytics, AI, & Business Intelligence',
                        'Predictive Modelling & Decision Sciences',
                        'Financial & Marketing Analytics',
                        'Operations & Supply Chain Analytics',
                        'Data Visualization & Dashboarding',
                        'Research-Driven Dissertation / Capstone Project',
                    ],
                    'tools' => ['Excel', 'SPSS', 'SmartPLS', 'Power BI', 'Tableau', 'Python', 'Machine Learning', 'AI', 'SQL'],
                    'placement_title' => '100% Placement Assistance & Paid Internships',
                    'placement_subtitle' => 'We provide comprehensive career support to ensure every graduate is placed.',
                    'placement_cards' => [
                        ['icon' => '🎯', 'title' => '100% Placement Assistance', 'desc' => 'Full placement assistance after MBA completion'],
                        ['icon' => '💼', 'title' => 'Structured, Paid Internships', 'desc' => 'Industry-embedded internship experiences'],
                        ['icon' => '🧑‍🏫', 'title' => 'Industry Mentorship', 'desc' => 'Mentorship and live projects with industry leaders'],
                        ['icon' => '🌐', 'title' => 'Strong Corporate Linkages', 'desc' => 'Across IT, logistics, consulting, EdTech, manufacturing, and international firms'],
                    ],
                    'placement_highlight' => 'Students in the past have gone on to pursue fully sponsored PhDs in the USA, to work at Oracle, India and other reputed MNCs.',
                    'placement_roles' => ['Business Analysts', 'Data Analysts', 'Financial Analysts', 'BI Executives', 'Consultants', 'Entrepreneurs'],
                    'mou_title' => 'MoUs with Top US Universities',
                    'mou_universities' => [
                        ['name' => 'Virginia Commonwealth University', 'icon' => '🏛️', 'desc' => 'Pursue higher studies in the USA without GMAT / GRE with tuition reductions.'],
                        ['name' => 'University of North Carolina, Greensboro', 'icon' => '🎓', 'desc' => 'Pursue higher studies in the USA without GMAT / GRE with tuition reductions.'],
                    ],
                    'mou_quote' => 'At Akal Business School, the MBA in Business Analytics is not just a degree—it is a globally oriented, ethically grounded, and industry-integrated pathway to leadership in the data-driven economy.',
                    'timeline_title' => 'Our Journey & Milestones',
                    'timeline_subtitle' => 'A legacy of rapid growth, global academic integrations, and record placement drives.',
                    'milestones' => [
                        ['year' => '2015', 'title' => 'Foundation of Akal University', 'desc' => 'Established under the Kalgidhar Society, providing value-based higher education to rural youth.'],
                        ['year' => '2018', 'title' => 'Scaffolding Akal Business School', 'desc' => 'Inception of management courses to develop future commerce and administration professionals.'],
                        ['year' => '2021', 'title' => 'US University Collaborations', 'desc' => 'Formed partnerships and MoUs with major US institutions including VCU and UNCG.'],
                        ['year' => '2024', 'title' => 'Launch of AI & Analytics Core', 'desc' => 'Embedded AI, Power BI, Python, and Tableau directly into the management curriculum.'],
                        ['year' => '2026', 'title' => 'Complete Full-Stack Transition', 'desc' => 'Reaching new milestones with record 95% placements and state-of-the-art computational labs.'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'About: Main Page',
            ],

            // ─── About Sub-Pages ───
            [
                'key' => 'page_about_founders',
                'value' => json_encode([
                    'hero_title' => 'Our Visionary Founders',
                    'hero_subtitle' => 'ABS is founded on the spiritual and academic legacy of Sant Attar Singh Ji Mastuana, realized through the lifelong dedication of Baba Iqbal Singh Ji.',
                    'section_title' => 'Baba Iqbal Singh Ji',
                    'section_para1' => 'A retired Director of Agriculture, Himachal Pradesh, Baba Iqbal Singh Ji (revered as Shiromani Panth Rattan) dedicated his post-retirement life to educational reform. Under his leadership, the Kalgidhar Society established 129 rural academies, 2 universities, and multiple charitable healthcare hubs across Northern India.',
                    'section_para2' => 'His core philosophy was "Value-Based Education" — marrying high-quality modern sciences and humanities with moral and spiritual fortitude, creating global citizens who lead with integrity.',
                    'kalgidhar_title' => 'The Kalgidhar Society',
                    'kalgidhar_para1' => 'The Kalgidhar Society (Baru Sahib) is a non-profit organization that manages educational systems, healthcare units, and social welfare programs across Punjab, Haryana, Rajasthan, Uttar Pradesh, and Himachal Pradesh.',
                    'kalgidhar_para2' => 'The society continues to expand its academic reach, ensuring that modern tools like AI, advanced computations, and big data technologies are taught alongside moral sciences to uplift rural underrepresented youth.',
                    'image' => '/storage/programs/webpage-auts-aboutus-3jun23.png',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'About: Founders Page',
            ],
            [
                'key' => 'page_about_chancellors_message',
                'value' => json_encode([
                    'hero_title' => "Chancellor's Message",
                    'hero_subtitle' => 'Words of guidance and inspiration for the next generation of business leaders and global visionaries.',
                    'section_title' => 'Developing Ethical Leaders',
                    'paragraphs' => [
                        '"Welcome to Akal Business School, where we strive to shape minds that are technically competent and ethically grounded. The global business ecosystem is evolving at an unprecedented pace, driven by rapid advancements in automation, artificial intelligence, and analytics."',
                        '"In this context, technical capability alone is not sufficient. We need leaders who possess the wisdom to use these tools for the betterment of society and the integrity to make choices that respect human values. At ABS, our goal is to build an environment that nurtures intellectual curiosity, analytical precision, and moral strength."',
                        '"I invite you to explore our programs, engage with our distinguished faculty, and become part of a community dedicated to excellence, innovation, and service."',
                    ],
                    'signoff' => '— Chancellor, Akal University',
                    'image' => '/images/placeholder-faculty.jpg',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => "About: Chancellor's Message",
            ],
            [
                'key' => 'page_about_vc_message',
                'value' => json_encode([
                    'hero_title' => "Vice Chancellor's Message",
                    'hero_subtitle' => 'Providing value-based quality education, learning, and research at the highest international level of excellence.',
                    'section_title' => 'Value-Based Quality Education',
                    'paragraphs' => [
                        '"Envisioned to establish a Centre of Excellence at par with the best Universities in the world, Akal University is committed to providing value-based quality education, learning, and research at the highest international level of excellence. The University is making steady and satisfactory progress in this direction. The dynamic and outstanding faculty, innovative pedagogical practices, modern and state-of-the-art infrastructure, drug-free campus, and honours school integrated programmes in basic and fundamental sciences, commerce, and languages at Bachelor and Master Levels are the hallmark of the academic standards of this University."',
                        '"With the rapid explosion of information technology, mass media, and globalization of the world economy, insular existence is no longer feasible. Consequently, the dynamics of education have undergone qualitative changes in the recent past. The evolving higher education system in the country is producing mere literates, devoid of our rich heritage of ancient wisdom of moral, ethical, and spiritual values."',
                        '"In its endeavor to adhere to the path of \'Sarbat Ka Bhala\' as envisioned by the Sikh Gurus, the university is committed to making value-based education accessible and affordable by providing liberal scholarships to meritorious and deserving students from all backgrounds."',
                        '"If you dream of receiving high-quality, value-based modern education in a drug-free and fully safe environment, Akal University is the right place to fulfill your aspirations. Thank you for your keen interest in the university. It will be a great pleasure for us to welcome you to the esteemed Akal University!"',
                    ],
                    'signoff_name' => '— Prof. Gurmail Singh',
                    'signoff_title' => 'Vice Chancellor, Akal University',
                    'image' => '/images/placeholder-faculty.jpg',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => "About: Vice Chancellor's Message",
            ],
            [
                'key' => 'page_about_directors_message',
                'value' => json_encode([
                    'hero_title' => "Director's Message",
                    'hero_subtitle' => 'Welcoming you to the core of computational business administration and analytical excellence.',
                    'section_title' => 'Bridging Tech & Management',
                    'paragraphs' => [
                        '"It is my distinct pleasure to welcome you to Akal Business School (ABS). We are at a critical juncture in business history. Traditional frameworks are shifting, and data has emerged as the single most critical asset for decision-making. Our mission at ABS is to equip students to thrive in this new landscape."',
                        '"Our curriculum is fully aligned with industry expectations, with intensive training in tools like Power BI, Tableau, Python, SQL, and ML integrated directly into the core management subjects. By keeping our class sizes small and focused, we ensure that every student receives individualized attention and guidance."',
                        '"Our partnerships with leading US universities and top corporate recruiters ensure that ABS graduates possess the skills and global mindset needed to make a substantial impact from day one. We look forward to guiding you on this transformative journey."',
                    ],
                    'signoff_name' => '— Director, Akal Business School',
                    'signoff_email' => 'director_abs@auts.ac.in',
                    'image' => '/storage/faculty/gurpreet-dhillon.jpg',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => "About: Director's Message",
            ],
            [
                'key' => 'page_about_kalgidhar',
                'value' => json_encode([
                    'hero_title' => 'The Kalgidhar Society',
                    'hero_subtitle' => 'Transforming rural lives through value-based modern education, healthcare, and social welfare.',
                    'section_title' => 'Serving Humanity with Devotion',
                    'para1' => 'The Kalgidhar Society – Baru Sahib is a non-profit charitable organisation focussed on providing quality education to fight against the alarming rise in drugs and alcohol abuse. With equal stress on Healthcare, Women Empowerment, and Social Welfare, the organisation has been instrumental in the socio-economic uplift of the poor in the far-flung rural areas of North India.',
                    'para2' => 'Established under the guidance of spiritual leaders, the Society runs Akal Academies and two universities (Akal University at Talwandi Sabo and Eternal University at Baru Sahib). These institutions are committed to providing a secure, distraction-free environment that combines the best of modern scientific education with deep moral and spiritual foundations.',
                    'pillars_title' => 'Key Pillars of Impact',
                    'pillars' => [
                        ['title' => 'Value-Based Education', 'desc' => 'Over 129 Akal Academies in rural Punjab, Haryana, Himachal Pradesh, Rajasthan, and Uttar Pradesh, educating more than 70,000 students.'],
                        ['title' => 'Healthcare Services', 'desc' => 'Running the Akal Charitable Hospital at Baru Sahib and organizing regular free medical and de-addiction camps in rural pockets.'],
                        ['title' => 'Women Empowerment', 'desc' => 'Providing vocational training and employment opportunities to rural women, fostering independence and confidence.'],
                        ['title' => 'Drug De-addiction', 'desc' => 'Combating substance abuse through rehabilitation, spiritual counseling, and healthy environment cultivation.'],
                    ],
                    'image' => '/storage/programs/about_img.png',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'About: The Kalgidhar Society',
            ],
            [
                'key' => 'page_about_recognitions',
                'value' => json_encode([
                    'hero_title' => 'Recognitions & Approvals',
                    'hero_subtitle' => 'Proudly recognized and approved by leading statutory bodies and international quality organizations.',
                    'section_title' => 'Official Recognitions & Certifications',
                    'recognitions' => [
                        ['title' => 'University Grants Commission (UGC)', 'desc' => 'Akal University is duly recognized by the University Grants Commission (UGC) – a statutory body of the Government of India established for the coordination, determination, and maintenance of standards of university education in India.', 'badge' => 'UGC'],
                        ['title' => 'Government of Punjab', 'desc' => 'Akal University is a full-fledged University established under the Punjab State Legislature Act No. 25 of 2015.', 'badge' => 'PUNJAB GOVT'],
                        ['title' => 'National Council for Teacher Education (NCTE)', 'desc' => 'Our Four-Year Integrated B.Sc.-B.Ed. and B.A.-B.Ed. programs are fully approved by the National Council for Teacher Education, a statutory body of the Government of India.', 'badge' => 'NCTE'],
                        ['title' => 'ISO 9001:2015 Certification', 'desc' => 'Certified Quality Management System demonstrating our commitment to excellence in providing higher education and administrative services.', 'badge' => 'ISO 9001'],
                        ['title' => 'ISO 45001:2018 Certification', 'desc' => 'Occupational Health and Safety Management System certified, ensuring a safe, secure, and healthy campus environment.', 'badge' => 'ISO 45001'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'About: Recognitions & Approvals',
            ],
            [
                'key' => 'page_about_why_abs',
                'value' => json_encode([
                    'hero_title' => 'Why Choose ABS?',
                    'hero_subtitle' => 'Redefine your future with a premium education in Business Analytics, backed by international collaborations and spiritual values.',
                    'intro_title' => 'Get the Opportunity You Desire & the Excellence to Make it Happen',
                    'intro_text' => 'Akal Business School (ABS) stands out as a premier choice for pursuing an MBA in Business Analytics. Our program is designed to empower future leaders with cutting-edge knowledge, global perspectives, and a commitment to social impact.',
                    'highlights_title' => 'Unparalleled Program Highlights',
                    'highlights' => [
                        ['title' => 'Focus on Business Analytics', 'desc' => 'Enroll in our cutting-edge curriculum tailored to meet the demands of the dynamic business landscape.'],
                        ['title' => 'Modeled After U.S. Excellence', 'desc' => 'Experience a top-notch academic structure mirroring the rigor of leading U.S. universities, ensuring a world-class education.'],
                        ['title' => 'International Faculty Expertise', 'desc' => 'Enjoy a global learning environment with 50% of our faculty bringing diverse international perspectives to the classroom.'],
                        ['title' => 'Distinguished Mentors', 'desc' => 'Benefit from guidance by industry experts, including Prof. Gurpreet Dhillon (AI & Cybersecurity expert) and Prof. Somendra Pant (academic of international repute).'],
                        ['title' => 'Small Class Size', 'desc' => 'Thrive in a conducive learning environment with small class sizes that ensure individualized attention and meaningful interactions.'],
                        ['title' => '100% Placement Record', 'desc' => 'Embark on your professional journey with confidence, as our program boasts a 100% placement rate for the first batch at competitive salaries.'],
                        ['title' => 'PhD & Global Opportunities', 'desc' => 'Seize opportunities for academic growth, with students securing fully funded PhD positions at prestigious U.S. universities and placements in Dubai and the UK.'],
                        ['title' => 'VCU Partnership', 'desc' => "Explore international pathways with Virginia Commonwealth University. Master's Program in Analytics without GRE/GMAT, 30% fee waiver, and seamless course transfers."],
                    ],
                    'faqs' => [
                        ['q' => 'What sets ABS apart from other business analytics programs?', 'a' => 'ABS stands out with its focus on cutting-edge analytics, a world-class academic structure modeled after leading U.S. universities, and a commitment to social impact, providing a holistic learning experience.'],
                        ['q' => 'How does the VCU partnership benefit students?', 'a' => "Our partnership with VCU allows students to pursue the Master's Program in Analytics without GRE/GMAT, with a 30% fee waiver and the added advantage of course transfers between ABS and VCU."],
                        ['q' => 'Are scholarships available for students?', 'a' => 'Yes, ABS offers generous scholarship programs backed by The Kalgidhar Trust to make quality education more accessible to aspiring students.'],
                        ['q' => 'How rigorous is the program?', 'a' => 'This program is rigorous enough to provide a nice blend of Data Science and Management. It is divided into 8 terms with an 11-week internship at the end of the 1st year.'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'About: Why ABS Page',
            ],

            // ─── Academics Page ───
            [
                'key' => 'page_academics',
                'value' => json_encode([
                    'hero_title' => 'Academic Programs',
                    'hero_subtitle' => 'ABS offers industry-demanded management degrees designed to build business competence and advanced analytics intelligence.',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Academics: Main Page',
            ],

            // ─── Admissions Page ───
            [
                'key' => 'page_admissions',
                'value' => json_encode([
                    'hero_title' => 'Admissions Overview',
                    'hero_subtitle' => 'A guide to securing your place at Akal Business School for the 2026-2028 academic session.',
                    'how_to_apply_title' => 'How to Apply',
                    'how_to_apply_text' => 'Admissions to Akal Business School are open to students who demonstrate analytical potential, academic consistency, and moral character. Follow our streamlined step-by-step application flow:',
                    'steps' => [
                        ['title' => 'Select Program & Check Eligibility', 'desc' => 'Verify that you satisfy the qualifying requirements for your desired course (MBA in AI & Business Analytics, BBA, PhD).'],
                        ['title' => 'Fill Application Form', 'desc' => 'Apply directly online via our comprehensive application wizard or utilize our Google Forms channel.'],
                        ['title' => 'Document Upload & Review', 'desc' => 'Submit academic transcript certificates, standard test scores (GMAT/CAT/MAT if applicable), and identity records.'],
                        ['title' => 'Admission Interview', 'desc' => 'Shortlisted candidates will be invited for a personal counseling and analytical evaluation interview.'],
                        ['title' => 'Securing Seat & Fee payment', 'desc' => 'Accepted students secure their admission by completing the initial tuition fee installment.'],
                    ],
                    'portal_title' => 'Admissions Portal',
                    'portal_text' => 'Admissions are currently active for the 2026-2028 batch. Apply directly today using our built-in application wizard, or submit details via our official Google Forms portal.',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Admissions: Main Page',
            ],

            // ─── Contact Page ───
            [
                'key' => 'page_contact',
                'value' => json_encode([
                    'hero_title' => 'Contact ABS',
                    'hero_subtitle' => 'Have questions about admissions, fees, or curriculum? Our support desk and counselors are ready to help.',
                    'form_title' => 'Admissions & General Inquiry',
                    'form_subtitle' => 'Fill out the contact form, and our representative will call you back within 24 business hours.',
                    'address_title' => 'Campus Address',
                    'address' => 'Akal Business School, Baru Sahib, Via Rajgarh, Distt. Sirmour, Himachal Pradesh - 173101',
                    'phone_title' => 'Phone Numbers',
                    'phones' => 'Admissions: +91-175-2391234\nGeneral Inquiry: +91-XXXXX-XXXXX',
                    'email_title' => 'Email Addresses',
                    'emails' => 'Admissions Desk: director_abs@auts.ac.in\nUniversity Office: info@auts.ac.in',
                    'hours_title' => 'Office Hours',
                    'hours' => 'Monday - Saturday: 9:00 AM to 5:00 PM\nSunday: Closed',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Contact: Page Content',
            ],

            // ─── Facilities Page ───
            [
                'key' => 'page_facilities',
                'value' => json_encode([
                    'hero_title' => 'Campus Facilities',
                    'hero_subtitle' => 'Providing a world-class environment with advanced learning hubs and comfortable, drug-free residential services.',
                    'section_title' => 'Infrastructure Designed for Excellence',
                    'section_text' => 'At Akal Business School, we believe that learning goes beyond the classroom. Our campus infrastructure is designed to provide students with the resources they need for both intellectual growth and comfortable living.',
                    'facilities' => [
                        ['title' => 'Library & Learning Centre', 'desc' => 'Our state-of-the-art library is RFID-automated, runs on Koha LMS, features silent reading rooms, and provides access to digital journals and databases.', 'href' => '/facilities/library', 'icon' => '📚'],
                        ['title' => 'Residential Hostels', 'desc' => 'Separate, secure hostels for boys and girls offering nutritious vegetarian food, air-conditioned reading rooms, indoor gymnasiums, and a spiritual prayer hall.', 'href' => '/facilities/hostels', 'icon' => '🏢'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Facilities: Main Page',
            ],

            // ─── Navigation Structure ───
            [
                'key' => 'site_navbar',
                'value' => json_encode([
                    'items' => [
                        ['label' => 'Home', 'href' => '/'],
                        ['label' => 'About', 'href' => '/about', 'submenu' => [
                            ['label' => 'About Us', 'href' => '/about'],
                            ['label' => 'Founders', 'href' => '/about/founders'],
                            ['label' => "Chancellor's Message", 'href' => '/about/chancellors-message'],
                            ['label' => "Vice Chancellor's Message", 'href' => '/about/vice-chancellors-message'],
                            ['label' => 'The Kalgidhar Society', 'href' => '/about/the-kalgidhar-society'],
                            ['label' => "Director's Message", 'href' => '/about/directors-message'],
                            ['label' => 'Recognitions & Approvals', 'href' => '/about/recognitions-approvals'],
                            ['label' => 'Vision & Mission', 'href' => '/about/vision-mission'],
                            ['label' => 'Why ABS', 'href' => '/about/why-abs'],
                        ]],
                        ['label' => 'Academics', 'href' => '/academics', 'submenu' => [
                            ['label' => 'MBA in Business Analytics', 'href' => '/academics/mba'],
                            ['label' => 'BBA (4-year course)', 'href' => '/academics/bba'],
                            ['label' => 'PhD in Management', 'href' => '/academics/phd'],
                            ['label' => 'Faculty', 'href' => '/faculty'],
                        ]],
                        ['label' => 'Admissions', 'href' => '/admissions', 'submenu' => [
                            ['label' => 'Fees Structure', 'href' => '/admissions/fees'],
                            ['label' => 'Scholarships', 'href' => '/admissions/scholarships'],
                            ['label' => 'How to Apply', 'href' => '/admissions/apply'],
                        ]],
                        ['label' => 'Facilities', 'href' => '/facilities', 'submenu' => [
                            ['label' => 'Library', 'href' => '/facilities/library'],
                            ['label' => 'Hostels', 'href' => '/facilities/hostels'],
                        ]],
                        ['label' => 'Campus Life', 'href' => '/campus-life', 'submenu' => [
                            ['label' => 'Events', 'href' => 'https://blog.auts.ac.in/category/campus-life/events/'],
                            ['label' => 'Success Stories', 'href' => 'https://blog.auts.ac.in/category/achievements/success-stories-achievements/'],
                        ]],
                        ['label' => 'Placements', 'href' => '/placements'],
                        ['label' => 'Downloads', 'href' => '/downloads'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Navigation: Menu Structure',
            ],

            // ─── Footer Content ───
            [
                'key' => 'site_footer',
                'value' => json_encode([
                    'brand_description' => 'Transforming future business leaders through rigorous business analytics, advanced AI management programs, distinguished faculty guidance, and global academic partnerships.',
                    'social_links' => [
                        ['platform' => 'facebook', 'url' => 'https://www.facebook.com/AkalBusinessSchool'],
                        ['platform' => 'instagram', 'url' => 'https://www.instagram.com/akalbusinessschool'],
                        ['platform' => 'linkedin', 'url' => 'https://www.linkedin.com/school/akal-business-school'],
                        ['platform' => 'youtube', 'url' => 'https://www.youtube.com/AkalBusinessSchool'],
                    ],
                    'address' => 'Akal Business School, Akal University, Raman Road, Talwandi Sabo, Bathinda, Punjab - 151302',
                    'phones' => '+91-9981119008, +91-8194801454',
                    'email' => 'director_abs@auts.ac.in',
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Footer: Content & Social Links',
            ],

            // ─── TopBar Content ───
            [
                'key' => 'site_topbar',
                'value' => json_encode([
                    'phone' => '+91-175-2391234',
                    'phone_href' => 'tel:+911752391234',
                    'email' => 'director_abs@auts.ac.in',
                    'email_href' => 'mailto:director_abs@auts.ac.in',
                    'social_links' => [
                        ['platform' => 'facebook', 'url' => 'https://www.facebook.com/AkalBusinessSchool'],
                        ['platform' => 'instagram', 'url' => 'https://www.instagram.com/akalbusinessschool'],
                        ['platform' => 'linkedin', 'url' => 'https://www.linkedin.com/school/akal-business-school'],
                        ['platform' => 'youtube', 'url' => 'https://www.youtube.com/AkalBusinessSchool'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'TopBar: Contact & Social Links',
            ],
        ];

        foreach ($pageContent as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    public function down(): void
    {
        $keys = [
            'section_why_abs_content',
            'section_impact_numbers_content',
            'section_campus_life_content',
            'section_global_learning_content',
            'page_about_main',
            'page_about_founders',
            'page_about_chancellors_message',
            'page_about_vc_message',
            'page_about_directors_message',
            'page_about_kalgidhar',
            'page_about_recognitions',
            'page_about_why_abs',
            'page_academics',
            'page_admissions',
            'page_contact',
            'page_facilities',
            'site_navbar',
            'site_footer',
            'site_topbar',
        ];

        Setting::whereIn('key', $keys)->delete();
    }
};
