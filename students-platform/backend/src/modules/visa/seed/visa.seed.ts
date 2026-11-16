import { IVisaGuide } from '../models/visa-guide.model';
import { VisaType, ProcessingTime } from '../types/visa.types';

type VisaSeedData = Omit<IVisaGuide, keyof import('mongoose').Document>;

export const visaSeedData: Partial<VisaSeedData>[] = [
    // 1. Germany - Student Visa (Nationales Visum / §16b AufenthG)
    {
        country: 'Germany',
        countryCode: 'DE',
        visaType: VisaType.student_visa,
        title: 'Germany Student Visa (Nationales Visum §16b AufenthG)',
        overview:
            'The German student visa (Nationales Visum) is a national long-stay visa required by non-EU/EEA nationals who wish to pursue a full degree programme in Germany. It is issued under §16b of the German Residence Act (AufenthG) and is typically valid for 3 months, allowing you to enter Germany and then convert it into a residence permit at the local Foreigners\' Office (Ausländerbehörde). Germany charges no tuition fees at most public universities, making this one of the most sought-after destinations for international students.',
        eligibility:
            'Non-EU/EEA nationals who have received an unconditional or conditional admission letter from a German state-recognised university or preparatory college (Studienkolleg). You must demonstrate sufficient financial means of at least EUR 11,208 per year (EUR 934/month) via a blocked account (Sperrkonto), scholarship, or formal sponsorship declaration (Verpflichtungserklärung).',
        steps: [
            {
                step: 1,
                title: 'Receive University Admission',
                description:
                    'Apply to a German university through uni-assist or directly via the university portal. Obtain your official admission letter (Zulassungsbescheid) before booking a visa appointment.',
                documents: [
                    'University admission letter (Zulassungsbescheid)',
                    'Proof of application via uni-assist (if applicable)',
                ],
                tips: 'Apply to universities at least 6-12 months before your intended start date. Conditional admission letters are also accepted at many embassies.',
            },
            {
                step: 2,
                title: 'Open a Blocked Account (Sperrkonto)',
                description:
                    'Open a German blocked account with at least EUR 11,208 (the 2024 annual rate). Popular providers include Deutsche Bank, Fintiba, and Expatrio. Funds are released monthly once you arrive in Germany.',
                documents: [
                    'Blocked account confirmation letter showing EUR 11,208 minimum',
                    'Bank statement or scholarship award letter as alternative',
                ],
                tips: 'Fintiba and Expatrio offer fast online setup and are widely accepted by embassies. Allow 1-2 weeks for the account to be fully funded.',
            },
            {
                step: 3,
                title: 'Gather Required Documents',
                description:
                    'Compile your complete application package. All non-German documents must be officially translated by a certified translator.',
                documents: [
                    'Valid passport (minimum 6 months validity beyond intended stay)',
                    'Completed visa application form (2 copies)',
                    'Two recent biometric passport photos',
                    'University admission letter',
                    'Blocked account confirmation or proof of funding',
                    'Certified proof of academic qualifications (A-levels, high school diploma, Bachelor\'s degree)',
                    'Academic transcripts with certified German or English translation',
                    'German language proficiency certificate (TestDaF, DSH, Goethe-Zertifikat) or English proficiency (IELTS, TOEFL) if programme is in English',
                    'Motivation letter / statement of purpose',
                    'Health insurance proof valid in Germany',
                    'APS certificate (required for applicants from China, India, Vietnam, and Mongolia)',
                ],
                tips: 'APS (Akademische Prüfstelle) certificate is mandatory for Chinese, Indian, Vietnamese, and Mongolian applicants. Schedule the APS evaluation well in advance as slots fill quickly.',
            },
            {
                step: 4,
                title: 'Book and Attend Visa Appointment',
                description:
                    'Book an appointment at the German embassy or consulate in your home country. Waiting times can be 4-12 weeks in high-demand countries. Attend in person with your complete document package.',
                documents: [
                    'All documents from Step 3',
                    'Visa fee payment (EUR 75)',
                ],
                tips: 'Book your appointment as early as possible. Some embassies accept walk-ins on specific days. Bring originals AND photocopies of all documents.',
            },
            {
                step: 5,
                title: 'Travel to Germany and Convert Visa',
                description:
                    'Upon arrival in Germany, register your address at the local registration office (Einwohnermeldeamt) within 2 weeks. Then book an appointment at the Ausländerbehörde to convert your national visa into a residence permit for study (Aufenthaltserlaubnis §16b).',
                documents: [
                    'Valid national visa',
                    'Registration confirmation (Anmeldebestätigung)',
                    'Enrolment certificate from your university (Immatrikulationsbescheinigung)',
                    'Proof of health insurance (public or private)',
                    'Blocked account passbook or updated bank statement',
                    'Biometric passport photos',
                    'Completed residence permit application form',
                ],
                tips: 'Enrol at your university immediately upon arrival. The Ausländerbehörde appointment can take several weeks to obtain, so book it as soon as you register your address.',
            },
        ],
        requiredDocuments: [
            'Valid passport (min. 6 months validity)',
            'Completed national visa application form (2 copies)',
            'Two recent biometric passport photos',
            'University admission letter (Zulassungsbescheid)',
            'Proof of financial means (blocked account EUR 11,208, scholarship, or Verpflichtungserklärung)',
            'Certified academic certificates and transcripts (with German/English translation)',
            'Language proficiency certificate (German or English depending on programme)',
            'Motivation letter',
            'Health insurance valid in Germany',
            'APS certificate (China, India, Vietnam, Mongolia only)',
            'Visa fee EUR 75',
        ],
        fees: 'EUR 75 (national visa). Residence permit conversion fee approx. EUR 100 at Ausländerbehörde.',
        processingTime: ProcessingTime.one_to_two_months,
        validityPeriod: 'National visa: 3 months. Residence permit: 1-2 years, renewable.',
        renewalInfo:
            'The residence permit for study is renewable as long as you remain enrolled and show adequate academic progress. Renewal appointments should be booked 8-10 weeks before expiry at the Ausländerbehörde.',
        usefulLinks: [
            {
                label: 'German Federal Foreign Office - Student Visa',
                url: 'https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq/-/606858',
            },
            {
                label: 'DAAD - Visa & Entry',
                url: 'https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/visa-and-entry/',
            },
            {
                label: 'Make it in Germany - Visa for Studies',
                url: 'https://www.make-it-in-germany.com/en/visa-residence/types/studies',
            },
            {
                label: 'APS Germany (for CN, IN, VN, MN applicants)',
                url: 'https://www.aps.org.cn/en',
            },
            {
                label: 'Fintiba Blocked Account',
                url: 'https://www.fintiba.com',
            },
        ],
        importantNotes: [
            'A national visa is NOT required for EU/EEA nationals - they may enter and study freely.',
            'The blocked account amount is updated annually; always verify the current figure on the DAAD or embassy website.',
            'Health insurance must be comprehensive and valid in Germany. Many German public health insurers (TK, AOK, Barmer) offer student plans.',
            'Working is permitted up to 120 full days or 240 half days per year on a student visa.',
            'Start the entire process at least 4-6 months before your semester begins.',
        ],
        lastUpdated: new Date('2025-01-15'),
        isVerified: true,
    },

    // 2. Germany - Job Seeker Visa
    {
        country: 'Germany',
        countryCode: 'DE',
        visaType: VisaType.job_seeker_visa,
        title: 'Germany Job Seeker Visa (Jobsuchvisum §20 AufenthG)',
        overview:
            'The German Job Seeker Visa (Jobsuchvisum) is a 6-month visa issued under §20 of the German Residence Act, designed for qualified professionals and graduates who wish to come to Germany to search for a job. It does not allow you to work but permits attendance at interviews and networking. Once you find employment, you can convert it into a work permit without leaving Germany.',
        eligibility:
            'You must hold a foreign university degree or vocational qualification that is recognised or recognisable in Germany. At least 5 years of professional experience in a skilled occupation is required. You must demonstrate sufficient financial means for the 6-month stay (typically EUR 5,604 or EUR 934 per month) and have basic German or English language skills for the job market you are targeting.',
        steps: [
            {
                step: 1,
                title: 'Get Your Qualification Recognised',
                description:
                    'Have your foreign degree formally recognised or assessed by the relevant German authority. Use the "Anabin" database to check if your degree is already listed as equivalent. For regulated professions, you must obtain formal recognition.',
                documents: [
                    'University degree certificate with certified translation',
                    'Academic transcripts',
                    'Anabin extract or Statement of Comparability from the KMK',
                ],
                tips: 'Use anabin.kmk.org to check your degree status. For unregulated professions a Statement of Comparability (Zeugnisbewertung) from the KMK is sufficient.',
            },
            {
                step: 2,
                title: 'Prepare Financial Proof',
                description:
                    'Demonstrate that you can financially support yourself for 6 months. This can be a blocked account, existing savings, or a formal declaration of support from a sponsor in Germany.',
                documents: [
                    'Bank statement showing at least EUR 5,604',
                    'Blocked account confirmation',
                    'Verpflichtungserklärung from a German sponsor (alternative)',
                ],
                tips: 'A blocked account specifically for the job seeker visa (not the student Sperrkonto) is the most straightforward option.',
            },
            {
                step: 3,
                title: 'Gather Application Documents',
                description:
                    'Compile your full document package and have all foreign documents officially translated into German.',
                documents: [
                    'Valid passport (min. 6 months validity beyond stay)',
                    'Completed visa application form (2 copies)',
                    'Two recent biometric passport photos',
                    'Degree recognition document or KMK Statement of Comparability',
                    'CV (Lebenslauf) in German, ideally in Europass format',
                    'Cover letter explaining your job search plan in Germany',
                    'Proof of financial means for 6 months',
                    'Health insurance valid for Germany',
                    'Proof of German language skills (if targeting German-speaking roles)',
                ],
                tips: 'A professional German CV and a well-structured job search plan significantly improve your application. Be specific about which industries and cities you are targeting.',
            },
            {
                step: 4,
                title: 'Apply at the German Embassy',
                description:
                    'Book and attend an appointment at the German embassy or consulate in your home country. Present all documents and the EUR 75 visa fee.',
                documents: [
                    'All documents from Step 3',
                    'EUR 75 visa fee',
                ],
                tips: 'Appointment wait times vary widely by country. Book as early as possible. Some embassies require additional documents, so check the specific embassy website.',
            },
            {
                step: 5,
                title: 'Arrive in Germany and Start Job Search',
                description:
                    'Register your address within 2 weeks of arrival (Anmeldung). You now have 6 months to find employment. Once you receive a job offer, apply to convert the visa into a work permit at the local Ausländerbehörde without leaving Germany.',
                documents: [
                    'Registration confirmation (Anmeldebestätigung)',
                    'Employment contract (for work permit conversion)',
                    'Employer\'s company registration documents (for conversion)',
                ],
                tips: 'Use the Federal Employment Agency\'s job portal (arbeitsagentur.de/jobsuche), LinkedIn, and XING for your job search. Networking events and career fairs are highly recommended.',
            },
        ],
        requiredDocuments: [
            'Valid passport (min. 6 months validity)',
            'Completed visa application form (2 copies)',
            'Two recent biometric passport photos',
            'Recognised foreign degree or KMK Statement of Comparability',
            'CV (Lebenslauf) in German, Europass format recommended',
            'Cover letter with job search plan',
            'Proof of financial means for 6 months (min. EUR 5,604)',
            'Health insurance valid in Germany',
            'German language certificate (B1+ recommended for German-speaking roles)',
            'Visa fee EUR 75',
        ],
        fees: 'EUR 75 (visa fee). Work permit conversion at Ausländerbehörde approx. EUR 100.',
        processingTime: ProcessingTime.two_to_four_weeks,
        validityPeriod: '6 months (non-extendable). Work permit issued after job is found can be 2-4 years.',
        renewalInfo:
            'The Job Seeker Visa cannot be extended. If you do not find employment within 6 months, you must leave Germany. With a confirmed job offer, convert directly to a work permit at the Ausländerbehörde.',
        usefulLinks: [
            {
                label: 'Make it in Germany - Job Seeker Visa',
                url: 'https://www.make-it-in-germany.com/en/visa-residence/types/job-seekers',
            },
            {
                label: 'Federal Foreign Office - Job Seeker Visa',
                url: 'https://www.auswaertiges-amt.de/en/visa-service/-/2091984',
            },
            {
                label: 'Anabin Database - Degree Recognition',
                url: 'https://anabin.kmk.org/anabin.html',
            },
            {
                label: 'KMK Statement of Comparability',
                url: 'https://www.kmk.org/zab/central-office-for-foreign-education/statement-of-comparability-for-foreign-qualifications.html',
            },
            {
                label: 'Federal Employment Agency Job Portal',
                url: 'https://www.arbeitsagentur.de/jobsuche/',
            },
        ],
        importantNotes: [
            'The Job Seeker Visa does NOT allow you to work during the 6-month period.',
            'You may attend job interviews, company visits, and networking events.',
            'Professional recognition is a hard requirement - ensure you start the process before applying for the visa.',
            'Germany has an official "Skilled Immigration Act" (Fachkräfteeinwanderungsgesetz) that has made the process more accessible since 2020.',
            'Health insurance is mandatory; international travel insurance covering Germany is typically accepted for the visa application period.',
        ],
        lastUpdated: new Date('2025-01-15'),
        isVerified: true,
    },

    // 3. Switzerland - Student Residence Permit (B Permit)
    {
        country: 'Switzerland',
        countryCode: 'CH',
        visaType: VisaType.residence_permit,
        title: 'Switzerland Student Residence Permit (B Permit)',
        overview:
            'Non-EU/EFTA nationals wishing to study in Switzerland for more than 3 months must obtain a residence permit for study purposes, commonly known as a B permit (Aufenthaltsbewilligung). The process begins with a student visa (Category D) at the Swiss embassy in your home country, which is then converted to the B permit upon arrival. Switzerland hosts globally top-ranked universities including ETH Zurich and EPFL.',
        eligibility:
            'You must hold an unconditional admission letter from a Swiss cantonal or federal university. You must demonstrate adequate financial means (approx. CHF 21,000 per year) via a personal bank account, scholarship, or Swiss guarantor. Basic knowledge of German, French, or Italian (depending on the canton) is often required.',
        steps: [
            {
                step: 1,
                title: 'Obtain University Admission',
                description:
                    'Apply directly to your chosen Swiss university. Federal institutes (ETH Zurich, EPFL) and cantonal universities have separate application portals. Obtain your official admission letter.',
                documents: [
                    'Admission letter from Swiss university',
                    'Proof of language proficiency (German/French/Italian or English)',
                ],
                tips: 'ETH Zurich and EPFL are highly competitive. Ensure your application is complete and submitted before the deadline, typically December-January for autumn entry.',
            },
            {
                step: 2,
                title: 'Apply for Student Visa (Category D) at Swiss Embassy',
                description:
                    'Apply for a Swiss national (Category D) visa at the Swiss embassy or consulate in your home country. The embassy will forward your application to the cantonal migration office (Migrationsamt) in Switzerland for a pre-approval that takes 8-12 weeks.',
                documents: [
                    'Valid passport (min. 3 months validity beyond stay)',
                    'Completed Swiss visa application form',
                    'Two recent biometric passport photos',
                    'University admission letter',
                    'Proof of financial means (CHF 21,000 per year, or approx. CHF 1,750/month)',
                    'Proof of accommodation in Switzerland',
                    'Certified academic certificates with translation',
                    'Motivation letter',
                    'Health insurance confirmation (or willingness to join Swiss scheme)',
                    'Visa fee CHF 60',
                ],
                tips: 'Apply for the visa at least 3-4 months before your study start date. The cantonal pre-approval alone can take 8-12 weeks.',
            },
            {
                step: 3,
                title: 'Travel to Switzerland',
                description:
                    'Once you receive your Category D visa, travel to Switzerland before the visa expiry date.',
                documents: [
                    'Valid Category D visa in passport',
                    'All original documents submitted for the visa',
                ],
                tips: 'Book your flight only after receiving the visa. Ensure your accommodation is confirmed.',
            },
            {
                step: 4,
                title: 'Register at the Municipal Office (Einwohnerkontrolle)',
                description:
                    'Within 14 days of arrival, register at the local Einwohnerkontrolle (residents\' registration office) of your commune. Bring your visa, rental agreement, and admission letter.',
                documents: [
                    'Valid passport with Category D visa',
                    'University admission letter',
                    'Rental agreement or accommodation confirmation',
                    'Completed registration form',
                ],
                tips: 'Registration is mandatory by law. You will receive a registration confirmation that you need for the next steps.',
            },
            {
                step: 5,
                title: 'Collect Your B Permit',
                description:
                    'The cantonal migration office will issue your B permit. In most cantons, you receive a notification to collect the permit card (Ausländerausweis) at the municipal office or cantonal migration office.',
                documents: [
                    'Registration confirmation',
                    'Proof of enrolment at Swiss university',
                    'Proof of health insurance (Swiss LAMal or equivalent)',
                    'Permit fee (varies by canton, approx. CHF 65-100)',
                ],
                tips: 'Enrol at the university and obtain your enrolment certificate as soon as possible after arrival, as this is required for the B permit.',
            },
        ],
        requiredDocuments: [
            'Valid passport (min. 3 months validity beyond intended stay)',
            'Completed Swiss visa application form',
            'Two recent biometric passport photos',
            'University admission letter',
            'Proof of financial means (CHF 21,000/year or CHF 1,750/month)',
            'Proof of accommodation in Switzerland',
            'Certified academic qualifications with German/French/English translation',
            'Motivation letter',
            'Swiss health insurance confirmation',
            'Visa fee CHF 60',
        ],
        fees: 'Category D visa: CHF 60. B permit: approx. CHF 65-100 (varies by canton).',
        processingTime: ProcessingTime.one_to_two_months,
        validityPeriod: 'B permit: 1 year, renewable annually for the duration of studies.',
        renewalInfo:
            'The B permit must be renewed annually. Bring proof of continued enrolment, updated financial means, and health insurance. Submit renewal at least 2-3 months before expiry.',
        usefulLinks: [
            {
                label: 'State Secretariat for Migration (SEM) - Students',
                url: 'https://www.sem.admin.ch/sem/en/home/themen/einreise/fuer-studierende.html',
            },
            {
                label: 'Swiss Embassies and Consulates',
                url: 'https://www.eda.admin.ch/eda/en/fdfa/representations-and-travel-advice/representations.html',
            },
            {
                label: 'Study in Switzerland',
                url: 'https://www.studyinswitzerland.plus/',
            },
            {
                label: 'ETH Zurich Admissions',
                url: 'https://ethz.ch/en/studies/registration-application.html',
            },
            {
                label: 'EPFL Admissions',
                url: 'https://www.epfl.ch/education/admission/',
            },
        ],
        importantNotes: [
            'EU/EFTA nationals do not need a visa but must still register and obtain a B permit for stays over 3 months.',
            'Switzerland is not in the EU but is part of the Schengen Area, so a Swiss visa also allows travel to Schengen countries.',
            'Health insurance in Switzerland is mandatory and expensive. Budget CHF 300-500 per month for a basic plan.',
            'Working is permitted up to 15 hours per week during term time and full-time during official holidays on a student B permit.',
            'Processing is faster in some cantons (e.g. Zurich, Vaud) than others; always check with the specific cantonal migration office.',
        ],
        lastUpdated: new Date('2025-01-15'),
        isVerified: true,
    },

    // 4. United Kingdom - Student Visa (formerly Tier 4)
    {
        country: 'United Kingdom',
        countryCode: 'GB',
        visaType: VisaType.student_visa,
        title: 'UK Student Visa (formerly Tier 4)',
        overview:
            'The UK Student Visa (introduced in October 2020, replacing Tier 4) is required for non-UK/Irish nationals who wish to study in the UK for more than 6 months. You must hold a Confirmation of Acceptance for Studies (CAS) from a UK Visas and Immigration (UKVI)-licensed sponsor (your university). The visa allows you to work part-time during term time and full-time during vacations.',
        eligibility:
            'You must have an unconditional offer from a UKVI-licensed Tier 4 sponsor. You must meet the English language requirement (B2 CEFR, typically IELTS 5.5-6.5 depending on the course). You must show sufficient financial means: GBP 1,334/month for studies in London or GBP 1,023/month elsewhere, held for 28 consecutive days before applying.',
        steps: [
            {
                step: 1,
                title: 'Receive Your CAS Number',
                description:
                    'After accepting your unconditional offer and paying any required deposits, your university will issue a Confirmation of Acceptance for Studies (CAS) reference number. You cannot apply for the visa without this.',
                documents: [
                    'Unconditional offer letter from UK university',
                    'CAS reference number (provided by university)',
                ],
                tips: 'Your CAS is only valid for 6 months and can only be used for one visa application. Do not apply for the visa until you have your CAS.',
            },
            {
                step: 2,
                title: 'Check and Prepare Financial Evidence',
                description:
                    'Ensure you have the required funds in your bank account for 28 consecutive days before your visa application date. For London: GBP 1,334 x duration in months (up to 9 months). For outside London: GBP 1,023 x duration.',
                documents: [
                    'Personal bank statement showing the required balance for 28 consecutive days',
                    'Official bank letter confirming the balance',
                    'Scholarship award letter (if applicable)',
                ],
                tips: 'Use an official bank statement stamped by the bank, or an online statement accompanied by a bank letter. The 28-day period must have ended no more than 31 days before your visa application.',
            },
            {
                step: 3,
                title: 'Apply Online and Book Biometrics',
                description:
                    'Apply online at the UK Government website. Pay the application fee and the Immigration Health Surcharge (IHS). Book a biometric enrolment appointment at a Visa Application Centre (VAC) in your country.',
                documents: [
                    'Valid passport',
                    'CAS number',
                    'Financial documents',
                    'English language test results (IELTS/TOEFL, unless exempt)',
                    'ATAS certificate (for certain subjects at Masters/PhD level)',
                    'Tuberculosis test results (if from a listed country)',
                ],
                tips: 'The Immigration Health Surcharge (IHS) is currently GBP 776/year for students. This is in addition to the visa fee and gives you access to NHS treatment.',
            },
            {
                step: 4,
                title: 'Attend Biometrics Appointment',
                description:
                    'Attend your in-person appointment at a UKVI Visa Application Centre to submit your biometrics (fingerprints and photo) and supporting documents.',
                documents: [
                    'Appointment confirmation',
                    'Valid passport',
                    'All original supporting documents',
                    'Document checklist completed online',
                ],
                tips: 'Some VACs offer a Priority or Super Priority service for faster processing at an extra cost. Check availability when booking.',
            },
            {
                step: 5,
                title: 'Receive BRP on Arrival in the UK',
                description:
                    'If approved, you receive a vignette sticker visa in your passport valid for 30 days. Collect your Biometric Residence Permit (BRP) from a designated Post Office within 10 days of arrival in the UK.',
                documents: [
                    'Visa vignette in passport',
                    'BRP collection letter',
                    'Proof of identity to collect BRP',
                ],
                tips: 'From 2025, a new eVisa digital scheme is being rolled out, replacing physical BRPs for most applicants. Check the latest UKVI guidance as this transition is ongoing.',
            },
        ],
        requiredDocuments: [
            'Valid passport',
            'CAS reference number from UK university',
            'Bank statements showing required funds for 28 consecutive days',
            'English language qualification (IELTS Academic or equivalent)',
            'ATAS certificate (if applicable for your subject)',
            'Tuberculosis test certificate (if from a listed country)',
            'Parental consent (if under 18)',
            'Visa fee GBP 490 (outside UK) or GBP 490 (inside UK)',
            'Immigration Health Surcharge (GBP 776/year)',
        ],
        fees: 'Visa fee: GBP 490. Immigration Health Surcharge: GBP 776 per year of study (payable upfront).',
        processingTime: ProcessingTime.two_to_four_weeks,
        validityPeriod: 'Course length plus 4 months (for degree courses). Typically 1-4 years.',
        renewalInfo:
            'If you need to extend your study in the UK, you must apply for an extension before your current visa expires. A Graduate Visa (2 years post-study work) is available after completing a UK degree.',
        usefulLinks: [
            {
                label: 'UKVI - Student Visa',
                url: 'https://www.gov.uk/student-visa',
            },
            {
                label: 'UKVI - Financial Requirements',
                url: 'https://www.gov.uk/student-visa/money',
            },
            {
                label: 'Immigration Health Surcharge',
                url: 'https://www.immigration-health-surcharge.service.gov.uk/',
            },
            {
                label: 'ATAS - Academic Technology Approval Scheme',
                url: 'https://www.gov.uk/guidance/academic-technology-approval-scheme',
            },
            {
                label: 'UCAS - UK University Applications',
                url: 'https://www.ucas.com',
            },
        ],
        importantNotes: [
            'Irish citizens and UK settled/pre-settled status holders do NOT need a Student Visa.',
            'You can work up to 20 hours per week during term time and full-time during vacations.',
            'The Immigration Health Surcharge is non-refundable even if your visa is refused.',
            'Some subjects require an Academic Technology Approval Scheme (ATAS) certificate from the Foreign, Commonwealth and Development Office before you apply.',
            'A Graduate Visa allows 2 years (3 for PhD) of post-study work in the UK after graduation.',
        ],
        lastUpdated: new Date('2025-02-01'),
        isVerified: true,
    },

    // 5. Netherlands - Student Residence Permit (MVV + VVR)
    {
        country: 'Netherlands',
        countryCode: 'NL',
        visaType: VisaType.residence_permit,
        title: 'Netherlands Student Residence Permit (MVV + VVR)',
        overview:
            'Non-EU/EEA nationals wishing to study in the Netherlands for more than 90 days must obtain a Machtiging tot Voorlopig Verblijf (MVV - authorisation for temporary stay) and a Verblijfsvergunning (VVR - residence permit). In most cases, your Dutch university acts as your sponsor and applies for the MVV on your behalf through the IND (Immigration and Naturalisation Service). This streamlined "entry procedure" means you often receive the MVV through the Dutch embassy in your home country without submitting a separate application yourself.',
        eligibility:
            'You must hold an unconditional offer of admission from a Dutch research university (universiteit) or university of applied sciences (hogeschool) that is IND-recognised. You must show sufficient financial means: EUR 950/month for the duration of studies. The university acts as your official sponsor.',
        steps: [
            {
                step: 1,
                title: 'Accept Your University Offer',
                description:
                    'Accept your unconditional offer of admission and complete all pre-enrolment steps required by your Dutch university. Notify the university\'s international student office that you need an MVV.',
                documents: [
                    'Signed acceptance of offer',
                    'Proof of academic qualifications',
                    'Proof of English proficiency (IELTS/TOEFL)',
                    'Copy of passport',
                ],
                tips: 'Most Dutch universities have a dedicated international office that guides you through the MVV process. Contact them immediately after accepting your offer.',
            },
            {
                step: 2,
                title: 'University Submits IND Application on Your Behalf',
                description:
                    'Your Dutch university submits the MVV and residence permit application to the IND (Immigratie- en Naturalisatiedienst) as your sponsor. You will receive a reference number and instructions to provide biometrics.',
                documents: [
                    'Valid passport copy (supplied to university)',
                    'Passport photo',
                    'Proof of tuition fee payment or scholarship confirmation',
                    'Proof of financial means (bank statement or scholarship)',
                ],
                tips: 'The IND processing time for the sponsored entry procedure is typically 2-4 weeks. The university bears responsibility for your application and stay.',
            },
            {
                step: 3,
                title: 'Collect MVV at Dutch Embassy',
                description:
                    'Once the IND approves the application, you will be notified to collect your MVV sticker from the Dutch embassy or consulate in your home country. Bring your original passport and the IND approval letter.',
                documents: [
                    'IND approval letter',
                    'Valid original passport',
                    'Passport photo',
                    'MVV collection fee',
                ],
                tips: 'The MVV is typically valid for 90 days and is a single-entry visa. Ensure you travel to the Netherlands before it expires.',
            },
            {
                step: 4,
                title: 'Travel to the Netherlands',
                description:
                    'Travel to the Netherlands with your MVV. Register with the municipality (BRP - Basisregistratie Personen) within 5 days of arrival. Your university will guide you to an IND desk visit to receive your VVR (residence permit card).',
                documents: [
                    'Valid passport with MVV',
                    'University enrolment confirmation',
                    'Proof of accommodation (rental contract)',
                ],
                tips: 'BSN (citizen service number) is issued after municipality registration and is required for banking, insurance, and many other services.',
            },
            {
                step: 5,
                title: 'Collect Residence Permit Card (VVR)',
                description:
                    'Attend the IND desk visit arranged by your university (usually on or near campus) to have your biometrics taken. Your VVR card will be mailed to the university or your registered address.',
                documents: [
                    'Valid passport',
                    'Municipality registration (BRP extract)',
                    'University enrolment certificate',
                ],
                tips: 'The VVR card is your primary ID document in the Netherlands. Keep it safe and carry it when travelling within the Schengen area.',
            },
        ],
        requiredDocuments: [
            'Valid passport (min. 6 months validity)',
            'University admission letter (unconditional)',
            'Proof of financial means (EUR 950/month)',
            'Proof of tuition fee payment',
            'English language certificate (IELTS/TOEFL)',
            'Passport photo',
            'Health insurance (arranged after arrival in NL)',
            'MVV collection fee (approx. EUR 58, paid at embassy)',
        ],
        fees: 'MVV collection fee: approx. EUR 58 (paid at embassy). VVR issuance is included in the IND fee paid by the university.',
        processingTime: ProcessingTime.two_to_four_weeks,
        validityPeriod: 'VVR valid for 1 year, renewable annually for the duration of studies.',
        renewalInfo:
            'Renewal is requested through the IND, typically sponsored again by the university. Submit at least 3 months before expiry. Show proof of continued enrolment and sufficient financial means.',
        usefulLinks: [
            {
                label: 'IND - Residence Permit for Study',
                url: 'https://ind.nl/en/residence-permits/study',
            },
            {
                label: 'Nuffic - International Student Guide',
                url: 'https://www.nuffic.nl/en/subjects/international-students',
            },
            {
                label: 'Study in Holland',
                url: 'https://www.studyinholland.nl/',
            },
            {
                label: 'Dutch Embassies - MVV Collection',
                url: 'https://www.government.nl/topics/immigration-to-the-netherlands/temporary-residence-permit-mvv',
            },
        ],
        importantNotes: [
            'EU/EEA and Swiss nationals do not need an MVV or VVR; they may study freely in the Netherlands.',
            'The university sponsors your application and is legally responsible for notifying the IND if you leave the programme.',
            'Health insurance in the Netherlands is mandatory. You must arrange this within 4 months of arrival. Monthly premiums start at approx. EUR 100-150 for a basic plan.',
            'Working is permitted up to 16 hours per week during the academic year and full-time in June, July, and August.',
            'The Netherlands uses DigiD (digital identity) for most government services; register as soon as you have your BSN.',
        ],
        lastUpdated: new Date('2025-01-20'),
        isVerified: true,
    },

    // 6. Canada - Student Direct Stream (SDS)
    {
        country: 'Canada',
        countryCode: 'CA',
        visaType: VisaType.student_visa,
        title: 'Canada Student Visa - Student Direct Stream (SDS)',
        overview:
            'The Student Direct Stream (SDS) is an accelerated Canadian study permit application process for eligible applicants from certain countries. Eligible applicants who meet all conditions can expect a processing time of 20 business days or less. You must hold a Letter of Acceptance (LOA) from a Designated Learning Institution (DLI) in Canada. SDS is available to legal residents of China, India, Morocco, Pakistan, Philippines, Senegal, Ukraine, Vietnam, Antigua and Barbuda, Brazil, Colombia, Costa Rica, Peru, and Trinidad and Tobago.',
        eligibility:
            'You must be a legal resident of an SDS-eligible country. You must have an LOA from a DLI. You must show a GIC (Guaranteed Investment Certificate) of CAD 20,635 from a participating Canadian financial institution, proof of tuition fee payment for the first year, an upfront medical exam, and an IELTS score of 6.0 in each band (or equivalent). For non-SDS countries, the regular student permit process applies but takes longer.',
        steps: [
            {
                step: 1,
                title: 'Receive Letter of Acceptance from a DLI',
                description:
                    'Apply to a Canadian Designated Learning Institution (DLI). Upon receiving your unconditional LOA, confirm your enrolment and pay your first-year tuition. Obtain a receipt for tuition payment.',
                documents: [
                    'Letter of Acceptance (LOA) from DLI',
                    'Tuition fee payment receipt (first year)',
                    'DLI number (listed on the LOA)',
                ],
                tips: 'Ensure your institution is a DLI by checking the Canadian Government DLI list. Most accredited Canadian universities and colleges are DLIs.',
            },
            {
                step: 2,
                title: 'Purchase a Guaranteed Investment Certificate (GIC)',
                description:
                    'Purchase a GIC worth at least CAD 20,635 from a participating Canadian bank (CIBC, Scotiabank, TD, BMO, National Bank, or SBI Canada). This is a mandatory requirement for SDS. The funds are released monthly after you arrive in Canada.',
                documents: [
                    'GIC purchase confirmation letter from Canadian bank',
                    'GIC certificate worth at least CAD 20,635',
                ],
                tips: 'The GIC process can take 2-4 weeks to complete. Apply early. The CIBC, Scotiabank, and SBI Canada international student GIC are the most commonly used.',
            },
            {
                step: 3,
                title: 'Complete Upfront Medical Exam',
                description:
                    'Visit an IRCC-approved panel physician in your home country for a medical examination. For SDS, this must be done before submitting your application.',
                documents: [
                    'Medical exam results from IRCC-approved panel physician',
                    'Passport valid for at least 1 year',
                ],
                tips: 'Use the IRCC panel physician locator at canada.ca to find approved doctors near you. Medical results are valid for 12 months.',
            },
            {
                step: 4,
                title: 'Apply Online via IRCC Portal',
                description:
                    'Create an IRCC account and submit your study permit application online. Select the SDS stream if eligible. Pay the application fee and biometrics fee. Upload all required documents.',
                documents: [
                    'Valid passport',
                    'Letter of Acceptance from DLI',
                    'GIC purchase confirmation',
                    'First-year tuition payment receipt',
                    'IELTS results (6.0 in each band for SDS)',
                    'Completed medical exam results',
                    'Financial proof beyond GIC (if required)',
                    'Statement of purpose (study plan)',
                    'Proof of ties to home country',
                    'Quebec Acceptance Certificate (CAQ) if studying in Quebec',
                ],
                tips: 'The Statement of Purpose (SOP) is critical. Explain why you chose Canada, your specific institution, and your plans after graduation. A strong SOP improves approval chances.',
            },
            {
                step: 5,
                title: 'Provide Biometrics',
                description:
                    'Book and attend a biometrics appointment at a Visa Application Centre (VAC) in your country. Biometrics are valid for 10 years.',
                documents: [
                    'Biometrics appointment confirmation',
                    'Valid passport',
                    'Biometrics fee receipt (CAD 85)',
                ],
                tips: 'If you gave biometrics for a previous Canadian application in the last 10 years, you may not need to give them again. Check your IRCC account.',
            },
            {
                step: 6,
                title: 'Receive Study Permit and Travel to Canada',
                description:
                    'If approved, you receive a Port of Entry (POE) Letter of Introduction. Travel to Canada and present this letter to the border officer, who will issue your physical study permit at the port of entry. Activate your GIC within 2 weeks of arrival.',
                documents: [
                    'Port of Entry letter',
                    'Valid passport',
                    'Letter of Acceptance',
                    'Proof of GIC',
                    'Tuition receipt',
                ],
                tips: 'The physical study permit is issued at the border, not mailed to you. Always carry all your original documents when crossing the Canadian border.',
            },
        ],
        requiredDocuments: [
            'Valid passport (min. 1 year validity beyond study period)',
            'Letter of Acceptance from a Designated Learning Institution (DLI)',
            'GIC certificate (CAD 20,635 minimum, from participating Canadian bank)',
            'First-year tuition fee payment receipt',
            'IELTS Academic score of 6.0 in each band (SDS requirement)',
            'Upfront medical exam results (IRCC-approved physician)',
            'Statement of purpose (study plan)',
            'Proof of ties to home country',
            'Two recent passport photos',
            'Study permit application fee CAD 150',
            'Biometrics fee CAD 85',
            'Quebec CAQ (if studying in Quebec)',
        ],
        fees: 'Study permit fee: CAD 150. Biometrics: CAD 85. GIC: CAD 20,635 (returned monthly after arrival).',
        processingTime: ProcessingTime.under_2_weeks,
        validityPeriod: 'Duration of study programme plus 90 days (for Post-Graduation Work Permit application).',
        renewalInfo:
            'Study permits must be extended from within Canada before they expire. Apply for an extension through your IRCC online account at least 30 days before expiry. After graduation, apply for a Post-Graduation Work Permit (PGWP) to work in Canada.',
        usefulLinks: [
            {
                label: 'IRCC - Student Direct Stream',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/student-direct-stream.html',
            },
            {
                label: 'IRCC - Study Permit',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
            },
            {
                label: 'Designated Learning Institution (DLI) List',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
            },
            {
                label: 'IRCC Panel Physicians',
                url: 'https://secure.cic.gc.ca/pp-md/pp-list.aspx',
            },
            {
                label: 'Post-Graduation Work Permit',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html',
            },
        ],
        importantNotes: [
            'SDS is only available to residents of specific countries; others must use the regular study permit stream.',
            'Students in Quebec must also obtain a Quebec Acceptance Certificate (CAQ) from the Ministere de l\'Immigration, Francisation et Integration (MIFI) before applying for the federal study permit.',
            'The GIC is not a cost - the money is returned to you monthly after you arrive. It is a financial assurance mechanism.',
            'Working is permitted up to 24 hours per week off-campus during academic sessions (as of November 2024) and full-time during scheduled breaks.',
            'The Post-Graduation Work Permit (PGWP) allows you to work in Canada for up to 3 years after graduating from an eligible programme, and is a common pathway to permanent residency.',
        ],
        lastUpdated: new Date('2025-03-01'),
        isVerified: true,
    },
];
