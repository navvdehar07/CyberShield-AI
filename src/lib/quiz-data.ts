import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Urgent Direct Deposit Re-route',
    category: 'Business Email Compromise (BEC)',
    scenario: 'You receive an email purportedly from your company HR director on Friday afternoon.',
    sender: 'Sarah Jenkins <sarah.jenkins-hr@comp-internal-payroll.net>',
    subject: 'URGENT: Verify your direct deposit before 5 PM payroll lock',
    messageBody: 'Hello,\n\nWe detected a routing discrepancy with your direct deposit account. If you do not re-verify your banking credentials at the portal below before 5:00 PM today, your bi-weekly paycheck will be held until next month.\n\nLink: http://comp-internal-payroll.net/portal/verify-bank\n\nBest regards,\nHR Operations Team',
    isPhishing: true,
    options: [
      {
        id: '1a',
        text: 'Click the link and submit your bank account information immediately so your paycheck isn’t delayed.',
        isCorrect: false,
      },
      {
        id: '1b',
        text: 'Reply to the email with a scanned voided check to prove your account details.',
        isCorrect: false,
      },
      {
        id: '1c',
        text: 'Do not click the link. Inspect the sender domain (@comp-internal-payroll.net vs official company domain) and contact HR through internal phone or official Slack.',
        isCorrect: true,
      },
      {
        id: '1d',
        text: 'Forward the email to all colleagues to warn them about the payroll lock.',
        isCorrect: false,
      },
    ],
    explanation: 'This is a classic Business Email Compromise (BEC) attack using artificial urgency ("before 5:00 PM today") and high financial stakes (delayed paycheck). The sender domain "comp-internal-payroll.net" is an external spoofed domain, not an internal corporate domain. Legitimate HR departments never demand banking updates via urgent unauthenticated HTTP links.',
    redFlags: [
      'Artificial deadline (5:00 PM Friday payroll lock) creating panic',
      'Spoofed external domain (@comp-internal-payroll.net)',
      'Direct link to sensitive credential input over unencrypted HTTP',
      'Generic closing without your employee ID'
    ],
    safeAction: 'Never input financial details via email links. Reach out directly to HR via verified internal contact directories.'
  },
  {
    id: 2,
    title: 'Suspicious Bank Security Alert via SMS',
    category: 'Smishing (SMS Phishing)',
    scenario: 'You receive an SMS alert claiming unauthorized activity on your bank card.',
    sender: '+1 (833) 492-9182',
    subject: 'SMS Text Message',
    messageBody: '[CHASE-SECURE]: A $1,429.00 transaction was initiated at BestBuy on your debit card ending in 4102. If NOT you, respond NO or immediately lock your card at: https://chase-security-verify.biz/cancel?id=4102',
    isPhishing: true,
    options: [
      {
        id: '2a',
        text: 'Click the link immediately to prevent the $1,429 charge from posting.',
        isCorrect: false,
      },
      {
        id: '2b',
        text: 'Do not click the link. Open your official bank app directly or call the customer service number on the back of your physical card.',
        isCorrect: true,
      },
      {
        id: '2c',
        text: 'Reply "NO" with your 4-digit PIN to prove ownership.',
        isCorrect: false,
      },
      {
        id: '2d',
        text: 'Forward the message to your friends on WhatsApp to see if they got it.',
        isCorrect: false,
      },
    ],
    explanation: 'Smishing uses sudden shock (unauthorized \$1,400+ charge) to bypass critical thinking. The link uses a fraudulent domain ("chase-security-verify.biz") instead of Chase.com. Banks never send direct authentication links ending in random TLDs like .biz to cancel transactions.',
    redFlags: [
      'Unsolicited text with high-dollar fraudulent transaction alert',
      'Lookalike domain (chase-security-verify.biz) designed to harvest banking logins',
      'Sense of emergency designed to prompt instant panic'
    ],
    safeAction: 'Always navigate independently to your bank\'s official app or call the phone number printed on the back of your physical debit/credit card.'
  },
  {
    id: 3,
    title: 'Package Delivery Fee Exception',
    category: 'Smishing / Postal Fraud',
    scenario: 'You receive an SMS claiming your package cannot be delivered due to an incorrect postal address.',
    sender: 'USPS-Alert <tracking-notify@post-update-info.com>',
    subject: 'Delivery On Hold',
    messageBody: 'USPS Notification: Package #US940011189956 cannot be delivered due to missing house number. Please update your address and pay the $1.85 redelivery customs fee within 24 hours: https://bit.ly/usps-track-9941',
    isPhishing: true,
    options: [
      {
        id: '3a',
        text: 'Pay the $1.85 fee because it’s a tiny amount and not worth delaying the package.',
        isCorrect: false,
      },
      {
        id: '3b',
        text: 'Recognize the scam: Postal services do not charge small fees via shortened bit.ly links. Go to official USPS.com and enter the tracking number manually.',
        isCorrect: true,
      },
      {
        id: '3c',
        text: 'Click the shortened link to see what the package contains.',
        isCorrect: false,
      },
      {
        id: '3d',
        text: 'Call the number in the SMS and provide your credit card over the phone.',
        isCorrect: false,
      },
    ],
    explanation: 'This "brushing / delivery fee" scam asks for a nominal amount ($1.85) to disarm victims, but the landing page is a credit card harvester that subscribes victims to recurring unauthorized monthly charges or steals card details.',
    redFlags: [
      'URL shortener (bit.ly) used to obscure the fraudulent landing page',
      'Demands a credit card fee for standard postal delivery',
      'Arbitrary 24-hour urgency countdown'
    ],
    safeAction: 'Verify package tracking exclusively on official carrier sites (e.g., USPS.com, FedEx.com, UPS.com) using your original order receipt.'
  },
  {
    id: 4,
    title: 'Executive Calendar Invitation Attachment',
    category: 'Malicious Attachment / Double Extension',
    scenario: 'An email arrives asking you to join an urgent budget revision meeting.',
    sender: 'David Miller, CFO <dmiller@company.com.financial-sync.org>',
    subject: 'Quarterly Executive Sync - Urgent Invite',
    messageBody: 'Team,\n\nPlease review the attached meeting schedule and budget breakdown for tomorrow’s board audit.\n\nAttachment: Q3_Board_Meeting_Schedule.pdf.exe (1.8 MB)\n\nPlease open the calendar invitation file to register your attendance.',
    isPhishing: true,
    options: [
      {
        id: '4a',
        text: 'Double click the attachment to add the meeting to your calendar.',
        isCorrect: false,
      },
      {
        id: '4b',
        text: 'Notice the double extension (.pdf.exe) which indicates an executable program disguised as a document. Report it to IT security immediately.',
        isCorrect: true,
      },
      {
        id: '4c',
        text: 'Rename the file to remove .exe and open it as a regular PDF.',
        isCorrect: false,
      },
      {
        id: '4d',
        text: 'Reply asking what time the meeting is without checking the attachment.',
        isCorrect: false,
      },
    ],
    explanation: 'Attackers frequently use double extensions (e.g. .pdf.exe or .docx.vbs) knowing that Windows file explorer often hides known file extensions by default. Running this file would execute malware or ransomware.',
    redFlags: [
      'Double extension: ".pdf.exe" indicates an executable payload',
      'Spoofed sender domain appending ".financial-sync.org"',
      'Calendar invite delivered as an executable binary instead of a standard .ics format'
    ],
    safeAction: 'Never run executable (.exe, .scr, .bat, .vbs) files received via email. Legitimate calendar invites use .ics files or direct calendar integration.'
  },
  {
    id: 5,
    title: 'Microsoft 365 Password Expiration Alert',
    category: 'Credential Harvesting',
    scenario: 'An automated email arrives informing you that your corporate account password expires today.',
    sender: 'Microsoft IT Support <no-reply@security-office365-helpdesk.online>',
    subject: 'Action Required: Your password expires in 2 hours',
    messageBody: 'Your Microsoft 365 work account password will expire today. To keep your current password and prevent email sync interruptions, click "Keep Current Password" below:\n\n[ KEEP SAME PASSWORD ] -> http://194.87.12.99/auth/msft/login.php\n\nIf you do not retain it, your account will be suspended.',
    isPhishing: true,
    options: [
      {
        id: '5a',
        text: 'Click the button and type your current password so it does not expire.',
        isCorrect: false,
      },
      {
        id: '5b',
        text: 'Identify that the link points to a direct IP address (194.87.12.99) and the "Keep Same Password" option violates standard security policies. Report the email.',
        isCorrect: true,
      },
      {
        id: '5c',
        text: 'Change your password right on that link to a brand new one.',
        isCorrect: false,
      },
      {
        id: '5d',
        text: 'Wait for 2 hours to see if your account actually locks.',
        isCorrect: false,
      },
    ],
    explanation: 'Legitimate enterprise systems do not provide a "keep your existing expired password" bypass link, and Microsoft never hosts corporate authentication pages on raw unencrypted IP addresses like http://194.87.12.99.',
    redFlags: [
      'Link points directly to a raw IP address (194.87.12.99)',
      'Promise of keeping an expiring password is a common phishing lure',
      'Threat of immediate account suspension'
    ],
    safeAction: 'Change passwords only inside your operating system settings or through your company\'s known Single Sign-On (SSO) portal.'
  },
  {
    id: 6,
    title: 'Legitimate Multi-Factor Authentication Verification',
    category: 'Legitimate vs Phishing Discriminator',
    scenario: 'You just clicked "Sign In" on GitHub from your home laptop, and an email arrives 10 seconds later.',
    sender: 'GitHub <noreply@github.com>',
    subject: '[GitHub] Please verify your device',
    messageBody: 'A sign-in attempt requires verification. To complete the sign-in, enter the verification code below on the screen where you initiated sign in:\n\nVerification Code: 839201\n\nLocation: Seattle, WA, USA\nDevice: Chrome on Windows 11\n\nIf this was not you, your password may be compromised. Go to github.com and change your password.',
    isPhishing: false,
    options: [
      {
        id: '6a',
        text: 'This is legitimate. The code was triggered by your own real-time sign in action, sent from official @github.com, contains no links to click, and instructs you to enter the code on the screen you already opened.',
        isCorrect: true,
      },
      {
        id: '6b',
        text: 'Phishing: Any email containing a numeric code is an attack.',
        isCorrect: false,
      },
      {
        id: '6c',
        text: 'Phishing: You should reply with your password to secure the account.',
        isCorrect: false,
      },
      {
        id: '6d',
        text: 'Ignore the email and delete your GitHub account.',
        isCorrect: false,
      },
    ],
    explanation: 'This is a genuine verification email. It arrives immediately following your own action, originates from the authentic domain (@github.com), accurately reflects your device and location, and provides a one-time code to enter on the page you already have open without asking you to click external third-party links.',
    redFlags: [],
    safeAction: 'Enter the verification code in the sign-in session you just initiated. Never share this code with anyone else over chat or phone.'
  },
  {
    id: 7,
    title: 'Parking Meter QR Code (Quishing)',
    category: 'Quishing (QR Code Phishing)',
    scenario: 'You park your car in a city downtown. A printed sticker is pasted over the digital parking meter screen displaying a QR code with the words: "Scan here to pay parking fee via mobile".',
    sender: 'Physical Sticker on Meter',
    subject: 'Pay Parking Fee Sticker',
    messageBody: 'QR Code sticker placed over the parking kiosk leading to: https://city-meter-pay.top/checkout?space=412\n\nThe screen prompts for credit card number, CVV, and billing ZIP code.',
    isPhishing: true,
    options: [
      {
        id: '7a',
        text: 'Scan the QR code and quickly pay the $2.50 to avoid getting a parking ticket.',
        isCorrect: false,
      },
      {
        id: '7b',
        text: 'Inspect the sticker: physical QR code stickers placed over meters are frequently malicious "quishing" attacks. Use the meter\'s official hardware buttons or the official city parking app.',
        isCorrect: true,
      },
      {
        id: '7c',
        text: 'Scan the QR code and send it to your parking enforcement office via email.',
        isCorrect: false,
      },
      {
        id: '7d',
        text: 'Assume parking is free today because the meter has a sticker.',
        isCorrect: false,
      },
    ],
    explanation: 'Quishing (QR phishing) relies on physical stickers placed over legitimate kiosks or sent via email. Since QR codes cannot be read with the human eye, victims do not inspect the destination domain (.top) until after scanning.',
    redFlags: [
      'Physical adhesive sticker placed over official kiosk hardware',
      'Suspicious destination TLD (.top) instead of the municipal government domain (.gov)',
      'Direct credit card harvester page'
    ],
    safeAction: 'Never scan physical QR stickers pasted over payment terminals. Use the kiosk card reader directly or the verified city mobile parking application.'
  },
  {
    id: 8,
    title: 'Urgent Wire Transfer / Confidential Project',
    category: 'CEO Fraud / Spear Phishing',
    scenario: 'You work in accounting. An email arrives from the CEO on a busy Tuesday morning.',
    sender: 'Arthur Vance <ceo.arthur.vance@gmail.com>',
    subject: 'CONFIDENTIAL: Urgent acquisition deposit',
    messageBody: 'Hi,\n\nI am currently in an all-day executive board meeting with our legal counsel and cannot take phone calls. We are finalizing an NDA-governed acquisition. I need you to wire $48,500 immediately to the escrow account details attached.\n\nKeep this strictly confidential until the official press release tomorrow.\n\nArthur Vance, CEO',
    isPhishing: true,
    options: [
      {
        id: '8a',
        text: 'Execute the wire transfer immediately to impress the CEO and avoid delaying the acquisition.',
        isCorrect: false,
      },
      {
        id: '8b',
        text: 'Recognize standard CEO fraud: the email is from a free @gmail.com address, explicitly discourages voice verification, and demands urgent wire transfer bypassing internal verification controls.',
        isCorrect: true,
      },
      {
        id: '8c',
        text: 'Reply to the Gmail address asking if $48,500 is the final amount.',
        isCorrect: false,
      },
      {
        id: '8d',
        text: 'Send $10,000 as a partial payment first.',
        isCorrect: false,
      },
    ],
    explanation: 'CEO Fraud exploits authority and confidentiality to prevent employees from confirming the request with peers. The attacker deliberately claims they "cannot take phone calls" so the victim doesn\'t call the real CEO.',
    redFlags: [
      'Executive using an external personal email address (@gmail.com)',
      'Pre-emptively excuses lack of availability for phone verification ("in board meeting")',
      'Demands bypass of normal accounting approval workflows',
      'High-pressure confidentiality clause'
    ],
    safeAction: 'Always enforce out-of-band verification (verbal confirmation in person or via verified corporate phone number) for any wire transfer or payment request.'
  },
  {
    id: 9,
    title: 'Google Drive Shared Invoice Link',
    category: 'Brand Spoofing & Cloud Abuse',
    scenario: 'You receive an email from a vendor you worked with 6 months ago.',
    sender: 'Invoicing Department <billing@legitimate-vendor.com.cdn-storage-vault.xyz>',
    subject: 'Overdue Invoice #INV-88390 - Final Notice',
    messageBody: 'Dear Partner,\n\nWe have not received payment for invoice #INV-88390 issued last month. Late penalties will be assessed starting midnight.\n\nPlease review the invoice breakdown stored on our secure drive:\nhttps://google.com.cdn-storage-vault.xyz/drive/v/invoice_88390.html\n\nAccounts Receivable',
    isPhishing: true,
    options: [
      {
        id: '9a',
        text: 'Open the link to see what the unpaid invoice is for.',
        isCorrect: false,
      },
      {
        id: '9b',
        text: 'Look closely at the domain: "google.com.cdn-storage-vault.xyz". The actual domain is cdn-storage-vault.xyz, NOT google.com. Do not open the link; verify with the vendor via known billing channels.',
        isCorrect: true,
      },
      {
        id: '9c',
        text: 'Forward the link to your billing team to pay it right away.',
        isCorrect: false,
      },
      {
        id: '9d',
        text: 'Reply with your credit card number to resolve the late fee.',
        isCorrect: false,
      },
    ],
    explanation: 'Attackers frequently prefix reputable domains like "google.com." into their subdomains to deceive users who only glance at the start of the host. The actual root domain is "cdn-storage-vault.xyz".',
    redFlags: [
      'Subdomain spoofing: "google.com" is placed as a subdomain on "cdn-storage-vault.xyz"',
      'Late fee threat with arbitrary midnight deadline',
      'HTML attachment or webpage pretending to be a document'
    ],
    safeAction: 'Check the real root domain (immediately before the first single slash and TLD) before trusting any URL.'
  },
  {
    id: 10,
    title: 'Authentic Security Alert from Google',
    category: 'Legitimate vs Phishing Discriminator',
    scenario: 'You logged in to your Google account on your new mobile phone while traveling in France.',
    sender: 'Google <no-reply@accounts.google.com>',
    subject: 'Security alert: New sign-in from iPhone in Paris, France',
    messageBody: 'Your Google Account was just signed in to from a new iPhone in Paris, France.\n\nIf you recently signed in, you do not need to take any action.\n\nIf you do not recognize this activity, review your devices at: https://myaccount.google.com/notifications',
    isPhishing: false,
    options: [
      {
        id: '10a',
        text: 'This is legitimate. It originates from @accounts.google.com, matches your actual travel location/device, links to the authentic https://myaccount.google.com, and does not pressure you with a fake deadline or ask for your password.',
        isCorrect: true,
      },
      {
        id: '10b',
        text: 'Phishing: Any email from Google about sign-in must be an attack.',
        isCorrect: false,
      },
      {
        id: '10c',
        text: 'Phishing: You should immediately change your password by clicking random links.',
        isCorrect: false,
      },
      {
        id: '10d',
        text: 'Forward the email to the French police.',
        isCorrect: false,
      },
    ],
    explanation: 'Legitimate security alerts accurately reflect your genuine actions, use verified sender domains (@accounts.google.com), direct users to standard canonical account URLs (myaccount.google.com), and don\'t demand immediate credential re-entry.',
    redFlags: [],
    safeAction: 'If you were indeed logging in while in Paris, no action is required. If not, open your browser and independently go to myaccount.google.com to review your active sessions.'
  }
];
