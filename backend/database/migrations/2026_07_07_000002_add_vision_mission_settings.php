<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        $setting = [
            'key' => 'page_about_vision_mission',
            'value' => json_encode([
                'hero_title' => 'Vision, Mission & Scope',
                'hero_subtitle' => 'Shaping future business leaders through analytics, global education, and value-driven ethical leadership.',
                'welcome_title' => 'Welcome to Akal Business School',
                'welcome_cards' => [
                    'Welcome to excellence in education at Akal Business School, a modern hub for global education in Business Analytics. With state-of-the-art facilities and an international faculty to meet the evolving demands of the industry. Akal Business School is dedicated to shaping future business leaders by integrating traditional values with modern education.',
                    'Located in the tranquil spiritual environment of Talwandi Sabo, the institution offers a promising foundation for students seeking excellence in management education. The school emphasizes holistic education, aiming to blend theoretical knowledge with practical application.',
                    'Akal Business School prides itself on its emphasis on Business Analytics, a rapidly growing field integral to strategic decision-making across industries. The curriculum is designed to equip students with essential skills in data analysis, visualization, and interpretation. The institution boasts an impressive network of international faculty members who bring diverse perspectives, global expertise, and cutting-edge insights into the classroom.',
                    'This dynamic faculty pool ensures that students are exposed to both theoretical foundations and contemporary business practices from a global viewpoint, making them competitive in international markets. The school is equipped with advanced facilities and provides students access to modern tools and technologies essential for business education. Programs such as Python, R, Tableau, Power BI and other analytical and statistical tools are integrated into the learning process, enabling students to stay ahead in a data-driven world.',
                ],
                'welcome_closing' => 'Akal Business School has laid a strong foundation for delivering quality management education while upholding its core values. The school consistently innovates, expands its industry ties, and focuses on creating graduates who are both professionally competent and ethically grounded. This dual commitment to tradition and progress positions Akal Business School as a promising institution with the potential to shape the future of business education in India.',
                'guiding_pillars_label' => 'Our Guiding Pillars',
                'guiding_pillars_title' => 'Mission & Vision',
                'mission_title' => 'Mission Statement',
                'mission_label' => 'Our Purpose',
                'mission_text' => 'Akal Business School is dedicated to nurturing ethical and innovative leaders through a robust foundation in business analytics education, fostering critical thinking, experiential learning, and cutting-edge global business practices. We empower students to excel in dynamic business environments and contribute to sustainable, value-driven global development.',
                'vision_title' => 'Vision Statement',
                'vision_label' => 'Our Aspiration',
                'vision_text' => 'Our vision is to become a globally recognized hub for excellence in education, research, and industry collaboration, leveraging analytics to develop future-ready professionals who drive innovation, create social impact, and inspire sustainable growth.',
                'scope_label' => 'Our Reach',
                'scope_title' => 'Scope of Akal Business School',
                'scope_desc' => 'The scope of Akal Business School encompasses its role as a pioneering institution in Business Analytics education and its broader contributions to the academic, professional, and social domains. The MBA in Business Analytics program aims to equip students with in-demand analytical skills, strategic decision-making abilities, and the capacity to thrive in a data-driven global economy.',
                'scope_items' => [
                    [
                        'title' => 'Academic Excellence',
                        'icon' => '📚',
                        'points' => [
                            'The program covers core and advanced dimensions of Business Analytics, including data visualization, machine learning, predictive modeling, big data infrastructure, and artificial intelligence.',
                            'Focus on integrating theoretical knowledge with real-world applications ensures a holistic learning experience.',
                            'Research opportunities in emerging areas such as Industry 4.0, digital transformation, and sustainability analytics provide a robust platform for scholarly contributions.',
                        ],
                    ],
                    [
                        'title' => 'Industry Relevance',
                        'icon' => '🏢',
                        'points' => [
                            'Collaborations with leading businesses and global organizations enable students to work on live projects, internships, and case studies, ensuring they remain industry-ready.',
                            'Training students on the latest analytics tools like Python, R, Tableau, and Power BI ensures alignment with market demands.',
                            'Partnerships with companies for certifications, skill-building workshops, and employment opportunities strengthen professional readiness.',
                        ],
                    ],
                    [
                        'title' => 'Global Outreach',
                        'icon' => '🌍',
                        'points' => [
                            'Akal Business School aspires to position itself as a global hub for business analytics education, attracting international faculty, industry experts, and students.',
                            'The school facilitates global student exchange programs, webinars, and international conferences to provide students with a multicultural learning environment.',
                        ],
                    ],
                    [
                        'title' => 'Personal & Professional Development',
                        'icon' => '🚀',
                        'points' => [
                            'The curriculum incorporates leadership training, problem-solving workshops, and ethical business practices to develop well-rounded professionals.',
                            'A focus on soft skills such as communication, teamwork, and adaptability complements technical competencies.',
                        ],
                    ],
                    [
                        'title' => 'Social Responsibility',
                        'icon' => '🤝',
                        'points' => [
                            'Rooted in Akal University\'s values, the business school emphasizes sustainability, inclusivity, and ethical decision-making in all its programs.',
                            'The institution encourages students to use Business Analytics for social impact, addressing challenges such as poverty, education, and environmental sustainability through data-driven solutions.',
                        ],
                    ],
                ],
                'scope_footer' => 'The scope of Akal Business School extends beyond academics, preparing students for leadership roles, fostering innovation, and contributing to the global business landscape with integrity and purpose.',
                'media_label' => 'In The Spotlight',
                'media_title' => 'Media Coverage',
                'media_intro_paragraphs' => [
                    'Welcome to Akal Business School, where innovation meets excellence. Located at the forefront of education, Akal Business School is redefining business education with programs that empower students to excel in a rapidly evolving global economy.',
                    'Akal Business School offers specialized courses in MBA and BBA in Business Analytics, designed with an industry-oriented curriculum that blends core management principles, technical expertise, and research acumen. From subjects like Marketing Management, Supply Chain Management, and Finance to cutting-edge technical modules such as Machine Learning, Big Data Technologies, and Data Visualization, students gain holistic knowledge to tackle real-world challenges.',
                    'Our focus on comprehensive development extends beyond academics. Students engage in workshops on business communication, soft skills, and personality development, ensuring they are workplace-ready.',
                ],
                'media_highlights' => [
                    ['icon' => '🌐', 'title' => 'International Faculty', 'desc' => 'Faculty from USA, Portugal, Ethiopia and more providing a truly global learning experience.'],
                    ['icon' => '📈', 'title' => '100% Placement Rate', 'desc' => 'Top placements as Business Analysts in companies like BJS Home Delivery, Eagle Trans, and HK Foods Dubai.'],
                    ['icon' => '🎓', 'title' => 'Higher Education Abroad', 'desc' => '1+1 MBA with Virginia Commonwealth University and Ph.D. placements in the USA.'],
                    ['icon' => '💼', 'title' => 'Summer Internships', 'desc' => 'Invaluable industry exposure bridging the gap between classroom learning and professional application.'],
                ],
                'media_closing_paragraphs' => [
                    'The diverse career pathways available to our graduates include roles like Data Analysts, Market Researchers, Business Intelligence Analysts, and opportunities across industries such as IT, Banking, FMCG, Tourism, and E-commerce.',
                    'Akal Business School also celebrates academic excellence, with students qualifying in prestigious exams like GMAT and actively participating in international conferences.',
                ],
                'media_quote' => 'At Akal Business School, we don\'t just educate—we transform lives. Join us to unlock your potential, explore global opportunities, and become a leader in your field.',
                'media_tagline' => 'Akal Business School — Excellence Through Analytics',
            ]),
            'type' => 'json',
            'group' => 'page_content',
            'label' => 'About: Vision & Mission Page',
        ];

        Setting::updateOrCreate(
            ['key' => $setting['key']],
            $setting
        );
    }

    public function down(): void
    {
        Setting::where('key', 'page_about_vision_mission')->delete();
    }
};
