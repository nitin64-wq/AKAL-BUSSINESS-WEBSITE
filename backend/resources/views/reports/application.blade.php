<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application Details - {{ $application->application_no }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
        }
        .header {
            border-bottom: 2px solid #C9A84C; /* Gold */
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header-grid {
            display: table;
            width: 100%;
        }
        .header-left {
            display: table-cell;
            vertical-align: middle;
        }
        .header-right {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
        }
        .school-name {
            font-size: 24px;
            font-weight: bold;
            color: #0A1628; /* Navy */
            margin: 0;
        }
        .school-sub {
            font-size: 14px;
            color: #8A9BBF;
            margin: 5px 0 0 0;
        }
        .title {
            font-size: 20px;
            font-weight: bold;
            color: #0A1628;
            margin: 0 0 10px 0;
            text-transform: uppercase;
        }
        .app-no {
            font-size: 16px;
            color: #C9A84C;
            font-weight: bold;
            margin: 0;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #0A1628;
            background-color: #F0F4FF;
            padding: 8px 12px;
            margin-top: 30px;
            margin-bottom: 15px;
            border-left: 4px solid #C9A84C;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        td {
            padding: 8px 0;
            vertical-align: top;
            font-size: 14px;
        }
        .label {
            font-weight: bold;
            color: #555;
            width: 25%;
        }
        .value {
            color: #111;
            width: 75%;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-Pending { background-color: #F59E0B; color: #FFF; }
        .badge-Under-Review { background-color: #3B82F6; color: #FFF; }
        .badge-Shortlisted { background-color: #10B981; color: #FFF; }
        .badge-Accepted { background-color: #10B981; color: #FFF; }
        .badge-Rejected { background-color: #EF4444; color: #FFF; }
        .badge-Waitlist { background-color: #6B7280; color: #FFF; }
        
        .footer {
            margin-top: 50px;
            border-top: 1px solid #EEE;
            padding-top: 15px;
            font-size: 11px;
            color: #777;
            text-align: center;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background-color: #C9A84C; color: #FFF; border: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; cursor: pointer;">Print / Download PDF</button>
    </div>

    <div class="header">
        <div class="header-grid">
            <div class="header-left">
                <h1 class="school-name">AKAL BUSINESS SCHOOL</h1>
                <p class="school-sub">Admissions Cell | director_abs@auts.ac.in</p>
            </div>
            <div class="header-right">
                <div class="title">Admission Application</div>
                <div class="app-no">No: {{ $application->application_no }}</div>
            </div>
        </div>
    </div>

    <div class="section-title">Program Selection</div>
    <table>
        <tr>
            <td class="label">Applied Program:</td>
            <td class="value">{{ $application->program ? $application->program->title : 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Application Status:</td>
            <td class="value">
                <span class="badge badge-{{ str_replace(' ', '-', $application->status) }}">
                    {{ $application->status }}
                </span>
            </td>
        </tr>
        <tr>
            <td class="label">Submission Date:</td>
            <td class="value">{{ $application->created_at->toFormattedDateString() }}</td>
        </tr>
    </table>

    <div class="section-title">Personal Details</div>
    <table>
        <tr>
            <td class="label">Full Name:</td>
            <td class="value">{{ $application->full_name }}</td>
        </tr>
        <tr>
            <td class="label">Email Address:</td>
            <td class="value">{{ $application->email }}</td>
        </tr>
        <tr>
            <td class="label">Phone Number:</td>
            <td class="value">{{ $application->phone }}</td>
        </tr>
        <tr>
            <td class="label">Date of Birth:</td>
            <td class="value">{{ $application->date_of_birth ? $application->date_of_birth->format('d-M-Y') : 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Gender:</td>
            <td class="value">{{ $application->gender ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Category:</td>
            <td class="value">{{ $application->category }}</td>
        </tr>
    </table>

    <div class="section-title">Address Details</div>
    <table>
        <tr>
            <td class="label">Address:</td>
            <td class="value">{{ $application->address ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">City & State:</td>
            <td class="value">{{ $application->city ?? 'N/A' }}, {{ $application->state ?? 'N/A' }} (Pincode: {{ $application->pincode ?? 'N/A' }})</td>
        </tr>
    </table>

    <div class="section-title">Academic & Professional Background</div>
    <table>
        <tr>
            <td class="label">Last Qualification:</td>
            <td class="value">{{ $application->last_qualification }}</td>
        </tr>
        <tr>
            <td class="label">Marks Percentage:</td>
            <td class="value">{{ $application->marks_percentage }}%</td>
        </tr>
        <tr>
            <td class="label">Entrance Exam:</td>
            <td class="value">{{ $application->entrance_exam ?? 'N/A' }} (Score: {{ $application->entrance_score ?? 'N/A' }})</td>
        </tr>
        <tr>
            <td class="label">Work Experience:</td>
            <td class="value">{{ $application->work_experience }} Months</td>
        </tr>
    </table>

    @if($application->remarks)
    <div class="section-title">Admission Cell Remarks</div>
    <div style="font-size: 14px; padding: 10px; background-color: #FFFDEE; border: 1px dashed #C9A84C; border-radius: 4px;">
        {{ $application->remarks }}
    </div>
    @endif

    <div class="footer">
        This is a system generated application report for Akal Business School. Generated on {{ date('d-M-Y H:i:s') }}.
    </div>
</body>
</html>
