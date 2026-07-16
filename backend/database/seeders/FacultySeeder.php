<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run()
    {
        // ------------------ CORE FACULTY (Sort Orders 1 - 6) ------------------
        
        // 1. Dr. Suraj Verma
        Faculty::create([
            'name' => 'Dr. Suraj Verma',
            'slug' => 'dr-suraj-verma',
            'designation' => 'Assistant Professor',
            'department' => 'Business Analytics',
            'specialization' => 'Marketing Management, Consumer Behavior, HRM, Digital Marketing, and Statistics',
            'qualification' => 'Ph.D. in Management (Shoolini University), MBA (Marketing & Finance)',
            'experience_years' => 12,
            'bio' => 'Dr. Suraj Verma holds a Ph.D. in Management from Shoolini University, along with an MBA in Marketing and Finance. His academic interests include Marketing Management, Consumer Behavior, Human Resource Management, Digital Marketing, and Statistics. He has published several research papers in reputed national and international journals and has contributed a book chapter in the field of management. His research primarily focuses on consumer decision-making and rural markets. He is also the holder of a granted design patent and multiple copyrights, and actively participates in faculty development programs, workshops, and academic conferences.',
            'photo' => '/images/faculty/Dr_Suraj_Verma.png',
            'email' => 'suraj.verma@abs.edu',
            'linkedin_url' => 'https://linkedin.com',
            'google_scholar' => 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Suraj+Verma+Akal+University',
            'publications' => 10,
            'is_distinguished' => true,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        // 2. Dr. Priyanka
        Faculty::create([
            'name' => 'Dr. Priyanka',
            'slug' => 'dr-priyanka',
            'designation' => 'Assistant Professor',
            'department' => 'Finance & Accounts',
            'specialization' => 'Finance, Accounting, and Taxation',
            'qualification' => 'Ph.D. (Central University of Punjab), UGC NET-JRF',
            'experience_years' => 3,
            'bio' => 'Dr. Priyanka is serving as an Assistant Professor in the Department of Akal Business School at Akal University. She completed her Ph.D. from the Central University of Punjab and has qualified the UGC NET–JRF. With approximately three years of experience in higher education, she has been actively involved in teaching, research activities, and academic mentoring. Her areas of specialization and research interest include Finance, Accounting, and Taxation. She is committed to academic excellence and continuously strives to enhance her knowledge while contributing meaningfully to research and higher education.',
            'photo' => '/images/faculty/Dr_Priyanka.png',
            'email' => 'priyanka@abs.edu',
            'linkedin_url' => 'https://linkedin.com',
            'google_scholar' => 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Priyanka+Akal+University',
            'publications' => 5,
            'is_distinguished' => false,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        // 3. Syed Owais Khursheed
        Faculty::create([
            'name' => 'Syed Owais Khursheed',
            'slug' => 'syed-owais-khursheed',
            'designation' => 'Assistant Professor',
            'department' => 'Strategy & Marketing',
            'specialization' => 'Financial Management, Accounting, Economics',
            'qualification' => 'MBA (Financial Management), M. Com, B.Ed. (SET Qualified)',
            'experience_years' => 6,
            'bio' => 'Syed Owais Khursheed is an Assistant Professor in Finance at Akal University. He holds an MBA (Financial Management), M. Com, and B.Ed., and has qualified for the State Eligibility Test (SET) for Assistant Professor. He is currently pursuing an Integrated Ph.D. (Finance) at the Department of Management Studies, University of Kashmir. He also holds additional diplomas in International Business Operations, Computer Applications, and Business Accounting. His teaching interests include Financial Management, Accounting, Economics, and related areas. His research spans agricultural finance, healthcare service quality, and consumer behaviour. He has published several research papers in reputable journals and has presented his work at national and international conference presentations. He contributed to a RUSA-sponsored research project on Healthcare Service Quality as a research fellow. In addition, he is actively involved in academic workshops, faculty development programs, and institutional development initiatives.',
            'photo' => '/images/faculty/Syed_Owais_Khursheed.png',
            'email' => 'owais@abs.edu',
            'linkedin_url' => 'https://linkedin.com',
            'google_scholar' => 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Syed+Owais+Khursheed+Akal+University',
            'publications' => 4,
            'is_distinguished' => false,
            'sort_order' => 3,
            'is_active' => true,
        ]);

        // 4. Dr. Ayash Manzoor
        Faculty::create([
            'name' => 'Dr. Ayash Manzoor',
            'slug' => 'dr-ayash-manzoor',
            'designation' => 'Assistant Professor',
            'department' => 'Human Resources',
            'specialization' => 'Consumer Behaviour, Strategic Management, Digital Marketing and Entrepreneurship',
            'qualification' => 'Ph.D. in Management (University of Kashmir), UGC-NET',
            'experience_years' => 3,
            'bio' => 'Dr. Ayash Manzoor is serving as an Assistant Professor in the Department of Akal Business School at Akal University. He is UGC-NET qualified academician and AMCAT certified professional with specialization in Marketing. He holds a Ph.D. in Management from University of Kashmir, Srinagar with research focused on Social Media Influencer Marketing and its impact on brand awareness and purchase intention among Generation Y and Generation Z. He has published several research papers and book chapters in reputed national and international journals. He has also contributed to various research projects sponsored by Indian Council of Social Science Research (ICSSR) as Research Assistant. His teaching and research interests include Consumer Behaviour, Strategic Management, Digital Marketing and Entrepreneurship. Dr. Ayash Manzoor has over 3 years of experience beyond teaching, including corporate exposure with Yes Bank India Ltd. and Extramarks Learning. His professional background in banking and the ed-tech sector has strengthened his industry perspective, enabling him to connect academic concepts with real-world business practices effectively.',
            'photo' => '/images/faculty/Dr_Ayash_Manzoor.png',
            'email' => 'ayash@abs.edu',
            'linkedin_url' => 'https://linkedin.com',
            'google_scholar' => 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Ayash+Manzoor+Akal+University',
            'publications' => 3,
            'is_distinguished' => false,
            'sort_order' => 4,
            'is_active' => true,
        ]);

        // 5. Dr. Rupinder Kaur
        Faculty::create([
            'name' => 'Dr. Rupinder Kaur',
            'slug' => 'dr-rupinder-kaur',
            'designation' => 'Assistant Professor',
            'department' => 'Economics & Decisions',
            'specialization' => 'Green Investment, Quantum Finance, Environmental Efficiency & Economic Development',
            'qualification' => 'Ph.D. in Business Administration, UGC-NET & JRF',
            'experience_years' => 9,
            'bio' => 'Dr. Rupinder Kaur is an accomplished academician and serves as an Assistant Professor in Finance. Dr. Kaur holds a Ph.D. in Business Administration with specialisation in Green Foreign Direct Investment and Sustainable Development. She qualified the UGC- NET examination and was awarded the prestigious Junior Research Fellowship (JRF) in recognition of academic excellence. Her research interests encompass Green investment, Quantum finance Environmental efficiency, and Economic development. She has published extensively in reputed national and international journals and regularly presents her scholarly work at prominent academic conferences.',
            'photo' => '/images/faculty/Dr_Rupinder_Kaur.png',
            'email' => 'rupinder@abs.edu',
            'linkedin_url' => 'https://linkedin.com',
            'google_scholar' => 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Rupinder+Kaur+Akal+University',
            'publications' => 6,
            'is_distinguished' => false,
            'sort_order' => 5,
            'is_active' => true,
        ]);

        // 6. Dr. Peerzada Munaqib Naseer
        Faculty::create([
            'name' => 'Dr. Peerzada Munaqib Naseer',
            'slug' => 'dr-peerzada-munaqib-naseer',
            'designation' => 'Assistant Professor',
            'department' => 'Operations & Supply Chain',
            'specialization' => 'Sustainable Consumption, Consumer Behaviour & Wellbeing',
            'qualification' => 'Ph.D. in Management, Integrated MBA (Marketing & IT)',
            'experience_years' => 5,
            'bio' => 'Dr. Peerzada Munaqib Naseer is an Assistant Professor in Marketing and Analytics with a Ph.D. in Management specializing in Sustainable Marketing. He holds an Integrated MBA in Marketing and IT. His research focuses on sustainable consumption, consumer behaviour and Wellbeing. He has published in reputed national and international journals and serves as a reviewer for leading publishers, including Emerald Insights and Frontiers.',
            'photo' => '/images/faculty/Dr_Peerzada_Munaqib_Naseer.png',
            'email' => 'munaqib@abs.edu',
            'linkedin_url' => 'https://linkedin.com',
            'google_scholar' => 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Dr.+Peerzada+Munaqib+Naseer+Akal+University',
            'publications' => 4,
            'is_distinguished' => false,
            'sort_order' => 6,
            'is_active' => true,
        ]);

        // ------------------ INTERNATIONAL ADVISORS (Sort Orders 7 - 18) ------------------

        // 7. Prof. Gurpreet Dhillon
        Faculty::create([
            'name' => 'Prof. Gurpreet Dhillon',
            'slug' => 'prof-gurpreet-dhillon',
            'designation' => 'Professor & G. Brint Ryan Endowed Chair of AI and Cybersecurity',
            'department' => 'Department of ITDS',
            'specialization' => 'AI and Cybersecurity, Information Systems Security',
            'qualification' => 'PhD (London School of Economics), MBA, BSc',
            'experience_years' => 25,
            'bio' => 'Prof. Gurpreet Dhillon is the G. Brint Ryan Endowed Chair of AI and Cybersecurity at the G. Brint Ryan College of Business, University of North Texas, USA. He is an expert in information systems security management and has authored multiple books and peer-reviewed articles.',
            'photo' => '/storage/faculty/gurpreet-dhillon.jpg',
            'email' => 'gurpreet.dhillon@unt.edu',
            'linkedin_url' => 'https://www.linkedin.com/in/gurpreet-dhillon',
            'google_scholar' => null,
            'publications' => 50,
            'is_distinguished' => true,
            'sort_order' => 7,
            'is_active' => true,
        ]);

        // 8. Prof. Somendra Pant
        Faculty::create([
            'name' => 'Prof. Somendra Pant',
            'slug' => 'prof-somendra-pant',
            'designation' => 'Professor Emeritus of MIS',
            'department' => 'David D. Reh School of Business',
            'specialization' => 'Management Information Systems, IT Strategy, E-Business',
            'qualification' => 'PhD, MBA, BTech',
            'experience_years' => 22,
            'bio' => 'Prof. Somendra Pant is Professor Emeritus of MIS at the David D. Reh School of Business, Clarkson University, Potsdam, NY. His research focuses on aligning business and IT strategies, and enterprise systems implementation.',
            'photo' => '/storage/faculty/somendra-pant.jpg',
            'email' => 'spant@clarkson.edu',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 35,
            'is_distinguished' => true,
            'sort_order' => 8,
            'is_active' => true,
        ]);

        // 9. Prof. Karin Hedström
        Faculty::create([
            'name' => 'Prof. Karin Hedström',
            'slug' => 'prof-karin-hedstrom',
            'designation' => 'Professor of Informatics',
            'department' => 'School of Business',
            'specialization' => 'Informatics, IT and Society, Digital Government',
            'qualification' => 'PhD (Örebro University), MSc',
            'experience_years' => 18,
            'bio' => 'Prof. Karin Hedström is a Professor of Informatics at Örebro University School of Business, Sweden. Her research centers around value-based design of IT, and the societal implications of digitalization.',
            'photo' => '/storage/faculty/karin-hedstrom.jpg',
            'email' => 'karin.hedstrom@oru.se',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 28,
            'is_distinguished' => true,
            'sort_order' => 9,
            'is_active' => true,
        ]);

        // 10. Prof. Mario Caldeira
        Faculty::create([
            'name' => 'Prof. Mario Caldeira',
            'slug' => 'prof-mario-caldeira',
            'designation' => 'Professor of Information Systems',
            'department' => 'ISEG - Institute of Economics and Management',
            'specialization' => 'Information Systems Management, E-Logistics, IT Auditing',
            'qualification' => 'PhD, MSc, Licenciatura',
            'experience_years' => 20,
            'bio' => 'Prof. Mario Caldeira is a Professor of Information Systems at ISEG - Institute of Economics and Management, University of Lisbon, Portugal. He serves as an advisor on digitalization to corporate boards across Europe.',
            'photo' => '/storage/faculty/mario-caldeira.jpg',
            'email' => 'mcaldeira@iseg.ulisboa.pt',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 30,
            'is_distinguished' => true,
            'sort_order' => 10,
            'is_active' => true,
        ]);

        // 11. Prof. Ella Kolkowska
        Faculty::create([
            'name' => 'Prof. Ella Kolkowska',
            'slug' => 'prof-ella-kolkowska',
            'designation' => 'Senior Lecturer of Informatics',
            'department' => 'School of Business',
            'specialization' => 'Information Security, Privacy, Value Sensitive Design',
            'qualification' => 'PhD (Örebro University), MSc',
            'experience_years' => 15,
            'bio' => 'Prof. Ella Kolkowska is a Senior Lecturer of Informatics at Örebro University School of Business, Sweden. Her research interest lies in balancing information security requirements with employee privacy and user experience.',
            'photo' => '/storage/faculty/ella-kolkowska.jpg',
            'email' => 'ella.kolkowska@oru.se',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 18,
            'is_distinguished' => false,
            'sort_order' => 11,
            'is_active' => true,
        ]);

        // 12. Prof. Devendra Thapa
        Faculty::create([
            'name' => 'Prof. Devendra Thapa',
            'slug' => 'prof-devendra-thapa',
            'designation' => 'Professor of Information Systems',
            'department' => 'Department of Information Systems',
            'specialization' => 'ICT4D, Information Infrastructures, Systems Analysis',
            'qualification' => 'PhD (University of Agder), MSc, BEng',
            'experience_years' => 16,
            'bio' => 'Prof. Devendra Thapa is a Professor of Information Systems at the University of Agder, Norway. He is known for his work in Information and Communication Technologies for Development (ICT4D) and collaborative computing.',
            'photo' => '/storage/faculty/devendra-thapa.jpg',
            'email' => 'devendra.thapa@uia.no',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 22,
            'is_distinguished' => false,
            'sort_order' => 12,
            'is_active' => true,
        ]);

        // 13. Prof. Rajiv Kohli
        Faculty::create([
            'name' => 'Prof. Rajiv Kohli',
            'slug' => 'prof-rajiv-kohli',
            'designation' => 'John N. Dalton Professor of Business',
            'department' => 'Raymond A. Mason School of Business',
            'specialization' => 'Health IT, Business Value of IT, IT Innovation',
            'qualification' => 'PhD (University of Maryland), MBA, MSc',
            'experience_years' => 24,
            'bio' => 'Prof. Rajiv Kohli is the John N. Dalton Professor of Business at William & Mary Raymond A. Mason School of Business, VA, USA. He is ranked among the top researchers globally in the field of Management Information Systems (MIS).',
            'photo' => '/storage/faculty/rajiv-kohli.jpg',
            'email' => 'rajiv.kohli@mason.wm.edu',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 48,
            'is_distinguished' => true,
            'sort_order' => 13,
            'is_active' => true,
        ]);

        // 14. Prof. Kane Smith
        Faculty::create([
            'name' => 'Prof. Kane Smith',
            'slug' => 'prof-kane-smith',
            'designation' => 'Assistant Professor of Information Systems',
            'department' => 'G. Brint Ryan College of Business',
            'specialization' => 'Cybersecurity Policy, Risk Management, Digital Ethics',
            'qualification' => 'PhD, MS, BS',
            'experience_years' => 8,
            'bio' => 'Prof. Kane Smith is an Assistant Professor at the University of North Texas G. Brint Ryan College of Business, USA. His research focuses on institutional cybersecurity behaviors and security analytics.',
            'photo' => '/storage/faculty/kane-smith.jpg',
            'email' => 'kane.smith@unt.edu',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 10,
            'is_distinguished' => false,
            'sort_order' => 14,
            'is_active' => true,
        ]);

        // 15. Prof. Rhonda Syler
        Faculty::create([
            'name' => 'Prof. Rhonda Syler',
            'slug' => 'prof-rhonda-syler',
            'designation' => 'Professor in Information Systems',
            'department' => 'Sam M. Walton College of Business',
            'specialization' => 'Enterprise Systems, Business Analytics, Project Management',
            'qualification' => 'PhD (Auburn University), MBA, BS',
            'experience_years' => 19,
            'bio' => 'Prof. Rhonda Syler is a Professor in Information Systems at the Sam M. Walton College of Business at University of Arkansas, USA. She specializes in business analytics governance and training enterprise analysts.',
            'photo' => '/storage/faculty/rhonda-syler.jpg',
            'email' => 'rsyler@walton.uark.edu',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 26,
            'is_distinguished' => true,
            'sort_order' => 15,
            'is_active' => true,
        ]);

        // 16. Vijay Narasimhamurthy
        Faculty::create([
            'name' => 'Vijay Narasimhamurthy',
            'slug' => 'vijay-narasimhamurthy',
            'designation' => 'Founder at IACT & Adjunct Faculty',
            'department' => 'Georgia Institute of Technology',
            'specialization' => 'Advanced Computing, High Performance Architectures',
            'qualification' => 'MTech, BEng',
            'experience_years' => 21,
            'bio' => 'Vijay Narasimhamurthy is the Founder at Institute Of Advanced Computing Technology, Bengaluru, India and Adjunct Faculty at the Georgia Institute of Technology, USA, bridging enterprise computing systems between the US and India.',
            'photo' => '/storage/faculty/vijay-narasimhamurthy.jpg',
            'email' => 'vijay@iact.in',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 12,
            'is_distinguished' => false,
            'sort_order' => 16,
            'is_active' => true,
        ]);

        // 17. Prof. Yasser Alhelaly
        Faculty::create([
            'name' => 'Prof. Yasser Alhelaly',
            'slug' => 'prof-yasser-alhelaly',
            'designation' => 'Ph.D. Researcher & Faculty',
            'department' => 'MagIC, NOVA IMS',
            'specialization' => 'Information Management, Smart Cities, Spatial Data Science',
            'qualification' => 'MSc, BSc',
            'experience_years' => 7,
            'bio' => 'Prof. Yasser Alhelaly is a Ph.D. researcher at MagIC, NOVA IMS, at The New University of Lisbon (UNL), researching spatial data models, smart city metrics, and analytical decision frameworks.',
            'photo' => '/storage/faculty/yasser-alhelaly.jpg',
            'email' => 'yasser@novaims.unl.pt',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 8,
            'is_distinguished' => false,
            'sort_order' => 17,
            'is_active' => true,
        ]);

        // 18. Prof. Dionysios Demetis
        Faculty::create([
            'name' => 'Prof. Dionysios Demetis',
            'slug' => 'prof-dionysios-demetis',
            'designation' => 'Associate Professor of Information Systems',
            'department' => 'Hull University Business School',
            'specialization' => 'Anti-Money Laundering Systems, Systems Theory, Risk and Uncertainty',
            'qualification' => 'PhD (London School of Economics), MSc, BSc',
            'experience_years' => 14,
            'bio' => 'Prof. Dionysios Demetis is an Associate Professor of Information Systems at Hull University Business School, UK. He is an expert in Anti-Money Laundering systems security and the application of systems theory to digitalization risks.',
            'photo' => '/storage/faculty/dionysios-demetis.jpg',
            'email' => 'd.demetis@hull.ac.uk',
            'linkedin_url' => 'https://www.linkedin.com',
            'google_scholar' => null,
            'publications' => 20,
            'is_distinguished' => true,
            'sort_order' => 18,
            'is_active' => true,
        ]);
    }
}
