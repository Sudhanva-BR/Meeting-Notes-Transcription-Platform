"""
Management command to seed the database with 5 realistic meetings.
Each meeting includes participants, transcript segments, AI summary, and action items.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from meetings.models import Meeting, MeetingParticipant, TranscriptSegment, MeetingSummary, ActionItem


class Command(BaseCommand):
    help = 'Seeds the database with sample meeting data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        Meeting.objects.all().delete()

        self.stdout.write('Seeding meetings...')
        self._seed_meeting_1()
        self._seed_meeting_2()
        self._seed_meeting_3()
        self._seed_meeting_4()
        self._seed_meeting_5()
        self.stdout.write(self.style.SUCCESS('Successfully seeded 5 meetings!'))

    # Meeting 1: Q3 Product Roadmap Planning
    def _seed_meeting_1(self):
        meeting = Meeting.objects.create(
            title='Q3 Product Roadmap Planning',
            date=timezone.now() - timedelta(days=2),
            duration_seconds=2700,
            meeting_type='planning'
        )

        participants = [
            ('Sarah Chen', 'sarah@company.com', '#7C3AED'),
            ('Michael Park', 'michael@company.com', '#3B82F6'),
            ('Emily Rodriguez', 'emily@company.com', '#EF4444'),
            ('David Kim', 'david@company.com', '#10B981'),
        ]
        for name, email, color in participants:
            MeetingParticipant.objects.create(meeting=meeting, name=name, email=email, avatar_color=color)

        segments = [
            ('Sarah Chen', 0, 18, "Alright everyone, thanks for joining. Let's kick off our Q3 product roadmap planning session. We have a lot to cover today, so let's dive right in."),
            ('Sarah Chen', 18, 35, "First, I want to do a quick recap of Q2. We shipped the new dashboard, launched the mobile app beta, and closed 15% more deals than projected. Great work team."),
            ('Michael Park', 35, 55, "Thanks Sarah. On the engineering side, we also reduced our average page load time by 40%, which had a direct impact on user retention metrics."),
            ('Emily Rodriguez', 55, 75, "That's great to hear Michael. From a design perspective, the user feedback on the new dashboard has been overwhelmingly positive. Our NPS score jumped from 42 to 67."),
            ('David Kim', 75, 95, "On the data side, we're seeing a 23% increase in daily active users since the dashboard launch. The engagement metrics are really encouraging."),
            ('Sarah Chen', 95, 120, "Excellent numbers across the board. Now let's talk about Q3 priorities. I've identified three major initiatives I'd like us to focus on."),
            ('Sarah Chen', 120, 150, "First, we need to finalize and ship the mobile app. The beta feedback has been strong but there are some critical issues we need to address before general availability."),
            ('Michael Park', 150, 180, "Agreed. The top issues from beta testers are push notification reliability, offline mode for viewing reports, and the sync latency between mobile and web."),
            ('Emily Rodriguez', 180, 210, "I've already started working on redesigned push notification flows. I think we can improve the UX significantly by grouping notifications by project and adding snooze options."),
            ('David Kim', 210, 240, "I can build a caching layer for the offline mode. We should prioritize which reports users need offline access to — I'd suggest starting with the daily summary and key metrics views."),
            ('Sarah Chen', 240, 270, "Good thinking David. The second major initiative is our AI-powered analytics feature. We've been talking about this for a while and I think Q3 is the right time to build it."),
            ('Michael Park', 270, 300, "I've been prototyping with the OpenAI API. We could offer natural language queries against their data — things like 'show me sales trends for the last 6 months' or 'which product had the highest growth rate'."),
            ('Emily Rodriguez', 300, 330, "That sounds amazing. From a UX perspective, I'd want to make sure we have a clean chat-like interface, with the ability to pin and save frequently asked queries."),
            ('David Kim', 330, 360, "We'll need to think carefully about data privacy and what information gets sent to external APIs. I'd recommend we build an intermediate layer that anonymizes and aggregates data before any external calls."),
            ('Sarah Chen', 360, 390, "Great point David. Let's make sure security review is part of the timeline. Third initiative — and this is a big one — we want to launch our enterprise tier."),
            ('Michael Park', 390, 420, "For the enterprise tier, we'll need SSO integration, role-based access controls, audit logging, and dedicated support channels. That's a significant amount of backend work."),
            ('Emily Rodriguez', 420, 450, "I'll need to design an admin console for enterprise customers. Think user management, team permissions, usage analytics — the whole nine yards."),
            ('David Kim', 450, 475, "We should also think about data residency requirements. Some enterprise clients will need their data stored in specific geographic regions."),
            ('Sarah Chen', 475, 510, "All great points. Let me summarize the timeline I'm thinking. Mobile app GA by end of July, AI analytics alpha by mid-August, and enterprise tier beta by end of September."),
            ('Michael Park', 510, 540, "That's ambitious but doable if we can get two more backend engineers. I've already submitted the hiring requests."),
            ('Emily Rodriguez', 540, 565, "I'll have the design specs for all three initiatives ready by next Friday. I want to do a design review with the team before engineering starts."),
            ('David Kim', 565, 590, "I'll prepare the data architecture documents and security requirements. Should have those ready by early next week."),
            ('Sarah Chen', 590, 620, "Perfect. Let's also talk about what we're deprioritizing. I think we should push the social sharing features and the marketplace integration to Q4."),
            ('Michael Park', 620, 645, "Agreed. Those are nice-to-haves but the three initiatives we discussed will have much higher business impact."),
            ('Emily Rodriguez', 645, 670, "One more thing — can we allocate some time for tech debt? The component library needs updating, and we have some accessibility issues that were flagged in the last audit."),
            ('Michael Park', 670, 700, "Good call Emily. I'll allocate 20% of engineering time each sprint for tech debt and maintenance work."),
            ('Sarah Chen', 700, 730, "That's fair. Alright team, I think we have a solid plan. Let me send out a summary document after this meeting. Any final thoughts?"),
            ('David Kim', 730, 755, "Just want to flag that we should coordinate with the sales team on the enterprise tier pricing and packaging. They'll need lead time to prepare materials."),
            ('Sarah Chen', 755, 780, "Great catch. I'll set up a meeting with the sales leadership this week. Thanks everyone — this was a productive session. Let's make Q3 our best quarter yet!"),
        ]
        for i, (speaker, start, end, content) in enumerate(segments):
            TranscriptSegment.objects.create(meeting=meeting, speaker_name=speaker, start_time=start, end_time=end, content=content, segment_order=i)

        MeetingSummary.objects.create(
            meeting=meeting,
            overview="The team reviewed Q2 achievements including a successful dashboard launch, mobile app beta, and 15% over-target sales. Q3 priorities were established around three major initiatives: mobile app general availability (target: end of July), AI-powered analytics feature (alpha by mid-August), and enterprise tier launch (beta by end of September). The team discussed technical requirements, design needs, and resource allocation for each initiative. Social sharing and marketplace integrations were deprioritized to Q4.",
            key_topics='["Q2 Recap & Metrics", "Mobile App GA", "AI Analytics Feature", "Enterprise Tier Launch", "Timeline & Resource Planning", "Tech Debt Allocation", "Q4 Deprioritization"]',
            outline="## Q2 Performance Review\n- Dashboard launch: NPS 42→67\n- Mobile app beta launched successfully\n- Sales exceeded projections by 15%\n- Page load time reduced 40%\n- DAU increased 23%\n\n## Q3 Initiative 1: Mobile App GA\n- Fix push notifications, offline mode, sync latency\n- Target: End of July\n- Caching layer for offline reports\n\n## Q3 Initiative 2: AI Analytics\n- Natural language queries against user data\n- Chat-like interface with saved queries\n- Data privacy & anonymization layer required\n- Target: Alpha by mid-August\n\n## Q3 Initiative 3: Enterprise Tier\n- SSO, RBAC, audit logging\n- Admin console design needed\n- Data residency considerations\n- Target: Beta by end of September\n\n## Resource & Timeline\n- Need 2 additional backend engineers\n- 20% sprint time for tech debt\n- Design specs ready by next Friday\n- Sales coordination needed for enterprise pricing"
        )

        action_items = [
            ('Submit design specs for all three Q3 initiatives by next Friday', 'Emily Rodriguez', False),
            ('Prepare data architecture and security requirement documents', 'David Kim', False),
            ('Submit hiring requests for 2 backend engineers', 'Michael Park', True),
            ('Set up meeting with sales leadership for enterprise tier pricing', 'Sarah Chen', False),
            ('Allocate 20% engineering time per sprint for tech debt', 'Michael Park', False),
        ]
        for title, assignee, completed in action_items:
            ActionItem.objects.create(meeting=meeting, title=title, assignee=assignee, is_completed=completed)

    # Meeting 2: Engineering Sprint Retrospective
    def _seed_meeting_2(self):
        meeting = Meeting.objects.create(
            title='Engineering Sprint Retrospective',
            date=timezone.now() - timedelta(days=5),
            duration_seconds=1800,
            meeting_type='retrospective'
        )

        participants = [
            ('Alex Thompson', 'alex@company.com', '#7C3AED'),
            ('Jessica Liu', 'jessica@company.com', '#3B82F6'),
            ('Ryan O\'Brien', 'ryan@company.com', '#EF4444'),
            ('Priya Sharma', 'priya@company.com', '#10B981'),
            ('Tom Wilson', 'tom@company.com', '#F59E0B'),
        ]
        for name, email, color in participants:
            MeetingParticipant.objects.create(meeting=meeting, name=name, email=email, avatar_color=color)

        segments = [
            ('Alex Thompson', 0, 20, "Welcome everyone to our Sprint 24 retrospective. Let's follow our usual format — what went well, what could be improved, and action items. Who wants to start?"),
            ('Jessica Liu', 20, 45, "I'll go first. What went well — we successfully deployed the payment processing overhaul with zero downtime. That was a huge win for the team."),
            ('Ryan O\'Brien', 45, 70, "Agreed. The deployment pipeline improvements we made last sprint really paid off. The automated rollback saved us twice during the deployment."),
            ('Priya Sharma', 70, 95, "From QA, I want to highlight that our test coverage went from 72% to 85% this sprint. The new integration tests caught three critical bugs before they hit production."),
            ('Tom Wilson', 95, 120, "The pair programming sessions were really valuable. I learned a ton about our authentication system from working with Jessica on the SSO integration."),
            ('Alex Thompson', 120, 145, "Great highlights. Now let's talk about what could be improved. I noticed we had some scope creep on the notification service. Ryan, can you speak to that?"),
            ('Ryan O\'Brien', 145, 175, "Yeah, the notification service was originally scoped for email only, but mid-sprint we added Slack and webhook support. That pushed our delivery back by three days."),
            ('Jessica Liu', 175, 200, "I think the scope creep happened because we didn't push back on the product request firmly enough. We should have negotiated a phased rollout instead."),
            ('Priya Sharma', 200, 225, "Another issue — the staging environment was down for almost a full day on Wednesday. That blocked all QA testing and we had to scramble on Thursday and Friday."),
            ('Tom Wilson', 225, 250, "Related to that, our monitoring and alerting for staging is basically non-existent. We didn't even know it was down until Priya reported it manually."),
            ('Alex Thompson', 250, 280, "Good point. We need the same level of observability in staging as we have in production. Let me add that to our infrastructure backlog."),
            ('Jessica Liu', 280, 310, "One more thing — our code review turnaround time has been slipping. Some PRs sat for two days without review. We should establish a 24-hour review SLA."),
            ('Ryan O\'Brien', 310, 335, "I agree with the review SLA. Maybe we can set up a rotation so there's always a designated reviewer each day?"),
            ('Priya Sharma', 335, 360, "That would help QA too. Faster reviews mean I get builds to test sooner, which means more thorough testing before sprint end."),
            ('Tom Wilson', 360, 385, "Can we also talk about documentation? The notification service changes weren't documented until after deployment. That caused confusion with the support team."),
            ('Alex Thompson', 385, 415, "Absolutely. Let's make documentation a requirement in our definition of done. No PR gets merged without updated docs."),
            ('Jessica Liu', 415, 440, "I like that. Should we also start doing sprint demos again? The product team has been asking for more visibility into what we're shipping."),
            ('Alex Thompson', 440, 465, "Yes, let's bring back sprint demos. Tom, can you organize the first one for next sprint?"),
            ('Tom Wilson', 465, 490, "Sure thing. I'll set up a 30-minute demo every other Thursday and send calendar invites to product and design teams."),
            ('Ryan O\'Brien', 490, 520, "One last thing on the positive side — the new CI/CD pipeline cut our build time from 18 minutes to 6 minutes. That's been a massive productivity boost."),
            ('Alex Thompson', 520, 560, "Awesome. Let me summarize the action items. We have staging monitoring, code review SLA, documentation in definition of done, sprint demos, and scope negotiation process. Let's vote on priorities."),
            ('Priya Sharma', 560, 585, "I'd prioritize staging monitoring highest. It directly impacts our ability to deliver quality work."),
            ('Alex Thompson', 585, 620, "Agreed. Alright team, great retro. Let's tackle these items in Sprint 25. Thanks everyone!"),
        ]
        for i, (speaker, start, end, content) in enumerate(segments):
            TranscriptSegment.objects.create(meeting=meeting, speaker_name=speaker, start_time=start, end_time=end, content=content, segment_order=i)

        MeetingSummary.objects.create(
            meeting=meeting,
            overview="Sprint 24 retrospective covering wins and improvement areas. Key wins included zero-downtime payment processing deployment, test coverage increase from 72% to 85%, successful pair programming sessions, and CI/CD pipeline optimization (build time 18min→6min). Areas for improvement: scope creep on notification service, staging environment downtime, slow code review turnaround, and missing documentation. The team agreed on five key action items for Sprint 25.",
            key_topics='["Sprint Wins", "Deployment Pipeline", "Test Coverage", "Scope Creep", "Staging Environment", "Code Review SLA", "Documentation Standards", "Sprint Demos"]',
            outline="## What Went Well\n- Payment processing deployed with zero downtime\n- Test coverage: 72% → 85%\n- CI/CD build time: 18min → 6min\n- Pair programming sessions valuable for knowledge sharing\n- Automated rollback saved deployments twice\n\n## What Needs Improvement\n- Scope creep on notification service (+3 days)\n- Staging environment down for full day\n- Code review turnaround slipping (2+ day waits)\n- Documentation lagging behind deployments\n- No monitoring/alerting for staging env\n\n## Action Items Agreed\n- Set up staging monitoring & alerting (highest priority)\n- Establish 24-hour code review SLA with reviewer rotation\n- Add documentation to definition of done\n- Resume sprint demos (bi-weekly Thursdays)\n- Implement scope negotiation process with product"
        )

        action_items = [
            ('Set up monitoring and alerting for staging environment', 'Alex Thompson', False),
            ('Establish 24-hour code review SLA with daily reviewer rotation', 'Jessica Liu', False),
            ('Add documentation to definition of done for all PRs', 'Alex Thompson', True),
            ('Organize bi-weekly sprint demos starting next sprint', 'Tom Wilson', False),
            ('Create scope negotiation template for product requests', 'Ryan O\'Brien', False),
        ]
        for title, assignee, completed in action_items:
            ActionItem.objects.create(meeting=meeting, title=title, assignee=assignee, is_completed=completed)

    # Meeting 3: Client Onboarding - Acme Corp
    def _seed_meeting_3(self):
        meeting = Meeting.objects.create(
            title='Client Onboarding: Acme Corp',
            date=timezone.now() - timedelta(days=8),
            duration_seconds=1500,
            meeting_type='client'
        )

        participants = [
            ('Lisa Chang', 'lisa@company.com', '#7C3AED'),
            ('Mark Stevens', 'mark@acmecorp.com', '#3B82F6'),
            ('Rachel Green', 'rachel@company.com', '#EF4444'),
        ]
        for name, email, color in participants:
            MeetingParticipant.objects.create(meeting=meeting, name=name, email=email, avatar_color=color)

        segments = [
            ('Lisa Chang', 0, 20, "Hi Mark, welcome aboard! Really excited to have Acme Corp as a customer. Today we'll walk you through the platform setup and make sure you're ready to hit the ground running."),
            ('Mark Stevens', 20, 40, "Thanks Lisa. We're excited too. Our team of about 50 people will be using the platform, so I want to make sure the setup is smooth for everyone."),
            ('Lisa Chang', 40, 65, "Absolutely. Let me introduce Rachel from our customer success team. She'll be your dedicated point of contact going forward."),
            ('Rachel Green', 65, 90, "Hi Mark! Great to meet you. I'll be here to help with anything you need — training, troubleshooting, feature requests. Don't hesitate to reach out anytime."),
            ('Mark Stevens', 90, 115, "Perfect. So, our main use case is project tracking and team collaboration. We're currently using a mix of spreadsheets and email, which is becoming unmanageable."),
            ('Lisa Chang', 115, 145, "That's a very common scenario. Let me share my screen and walk you through the main dashboard. As you can see, this is where your team will land when they log in."),
            ('Lisa Chang', 145, 175, "The left sidebar gives you quick access to projects, team members, reports, and settings. You can customize this layout per team or per user."),
            ('Mark Stevens', 175, 195, "Can we set up different permission levels? We have project managers who need full access and team members who should only see their assigned tasks."),
            ('Rachel Green', 195, 225, "Yes, absolutely. We support four permission levels — Admin, Manager, Member, and Viewer. You can also create custom roles if those don't fit your needs exactly."),
            ('Lisa Chang', 225, 260, "Let me show you the project creation flow. You can create projects manually, import from CSV, or even connect your existing tools through our integrations."),
            ('Mark Stevens', 260, 285, "We use Jira for some teams and Asana for others. Can we migrate data from both?"),
            ('Rachel Green', 285, 315, "We have native integrations with both Jira and Asana. I can set up the migration for you — typically it takes about 2-3 hours depending on data volume, and there's zero downtime."),
            ('Lisa Chang', 315, 345, "One feature I want to highlight is our reporting suite. You get real-time dashboards, custom report builders, and automated weekly summaries sent to stakeholders."),
            ('Mark Stevens', 345, 370, "That's exactly what our VP has been asking for. Can we customize which metrics appear in the weekly summary?"),
            ('Lisa Chang', 370, 395, "Completely customizable. You can choose KPIs, add commentary, and even schedule different reports for different stakeholders."),
            ('Mark Stevens', 395, 420, "This looks great. What about training for our team? I don't want to be the bottleneck for rolling this out."),
            ('Rachel Green', 420, 455, "We offer three training options. First, self-paced video courses that your team can complete on their own. Second, live group training sessions — I can schedule these for your team. Third, one-on-one sessions for power users who want to dive deep."),
            ('Mark Stevens', 455, 475, "Let's do the live group training. Can we schedule two sessions — one for project managers and one for regular team members?"),
            ('Rachel Green', 475, 500, "Absolutely. I'll send you a scheduling link after this call. We usually recommend doing the PM training first, then the team member training a few days later."),
            ('Lisa Chang', 500, 530, "Mark, one more thing — we have a 30-day onboarding period where you get priority support. Any issues, you'll get a response within 2 hours."),
            ('Mark Stevens', 530, 555, "That's reassuring. I think we have everything we need to get started. When can we begin the data migration?"),
            ('Rachel Green', 555, 580, "I can start the migration as early as tomorrow. I'll send you a checklist of what I'll need — mainly export files from Jira and Asana, and a list of users with their emails."),
            ('Lisa Chang', 580, 610, "Sounds like a plan! Mark, thanks for your time today. Rachel will take great care of you. Welcome to the family!"),
            ('Mark Stevens', 610, 630, "Thank you both! Looking forward to getting our team up and running. This is going to be a huge improvement over our current setup."),
        ]
        for i, (speaker, start, end, content) in enumerate(segments):
            TranscriptSegment.objects.create(meeting=meeting, speaker_name=speaker, start_time=start, end_time=end, content=content, segment_order=i)

        MeetingSummary.objects.create(
            meeting=meeting,
            overview="Onboarding session with Mark Stevens from Acme Corp (50-person team). Covered platform walkthrough, permission setup (4 levels + custom roles), data migration from Jira and Asana (both natively supported, 2-3 hour migration), reporting suite capabilities, and training options. Acme opted for live group training sessions — one for PMs, one for team members. 30-day priority support period activated. Data migration can begin as early as tomorrow.",
            key_topics='["Platform Walkthrough", "Permission Levels", "Data Migration (Jira & Asana)", "Reporting Suite", "Training Options", "Onboarding Timeline"]',
            outline="## Platform Overview\n- Dashboard walkthrough with customizable sidebar\n- Four permission levels: Admin, Manager, Member, Viewer\n- Custom roles available\n\n## Data Migration\n- Native Jira and Asana integrations\n- Migration takes 2-3 hours, zero downtime\n- Can start as early as tomorrow\n- Need: export files from Jira/Asana + user email list\n\n## Reporting\n- Real-time dashboards\n- Custom report builder\n- Automated weekly stakeholder summaries\n- Fully customizable KPIs\n\n## Training Plan\n- Live group training selected\n- Session 1: Project managers\n- Session 2: Team members (a few days later)\n\n## Support\n- 30-day priority support (2-hour response time)\n- Rachel Green as dedicated CSM"
        )

        action_items = [
            ('Send data migration checklist to Mark Stevens', 'Rachel Green', True),
            ('Schedule live training sessions (PM + team)', 'Rachel Green', False),
            ('Export Jira and Asana data and send to Rachel', 'Mark Stevens', False),
            ('Set up Acme Corp workspace with custom permission roles', 'Lisa Chang', False),
        ]
        for title, assignee, completed in action_items:
            ActionItem.objects.create(meeting=meeting, title=title, assignee=assignee, is_completed=completed)

    # Meeting 4: Design Review - Mobile App Redesign
    def _seed_meeting_4(self):
        meeting = Meeting.objects.create(
            title='Design Review: Mobile App Redesign',
            date=timezone.now() - timedelta(days=12),
            duration_seconds=2100,
            meeting_type='design'
        )

        participants = [
            ('Nina Patel', 'nina@company.com', '#7C3AED'),
            ('Chris Martinez', 'chris@company.com', '#3B82F6'),
            ('Anna Johansson', 'anna@company.com', '#EF4444'),
            ('Ben Walker', 'ben@company.com', '#10B981'),
        ]
        for name, email, color in participants:
            MeetingParticipant.objects.create(meeting=meeting, name=name, email=email, avatar_color=color)

        segments = [
            ('Nina Patel', 0, 20, "Alright team, let's review the mobile app redesign mockups. I've shared the Figma file in the chat. We're focusing on the three main user flows today."),
            ('Chris Martinez', 20, 45, "I've been through the designs. Really love the new navigation pattern. The bottom tab bar is much more intuitive than the hamburger menu we had before."),
            ('Anna Johansson', 45, 70, "Thanks Chris. I based it on our user research findings — 78% of users said they struggled to find features in the old navigation. The bottom tabs surface the top 5 most-used features."),
            ('Ben Walker', 70, 95, "From an engineering perspective, the tab bar is straightforward to implement. I do have a question about the gesture-based navigation between tabs — is that a must-have?"),
            ('Anna Johansson', 95, 120, "I'd say it's a nice-to-have for V1. Let's get the basic tap navigation working first, and we can add swipe gestures in a follow-up update."),
            ('Nina Patel', 120, 150, "Agreed. Let's talk about the home feed redesign. Anna, walk us through the changes."),
            ('Anna Johansson', 150, 185, "Sure. The new home feed uses a card-based layout instead of the current list view. Each card shows a preview image, title, key metrics, and quick action buttons. The cards support both horizontal and vertical scrolling."),
            ('Chris Martinez', 185, 215, "The card design looks clean. I'm wondering about performance though — those preview images could slow down the scroll if we're loading dozens of cards."),
            ('Ben Walker', 215, 245, "We should implement lazy loading and use thumbnail-sized images for the feed. I'd also recommend skeleton screens while loading — much better UX than a spinner."),
            ('Anna Johansson', 245, 270, "Great suggestion Ben. I'll add skeleton screen designs to the Figma file. I already have the loading state concepts from the web app that we can adapt."),
            ('Nina Patel', 270, 300, "Let's move to the third flow — the task creation experience. This was flagged as the biggest pain point in our last usability study."),
            ('Anna Johansson', 300, 330, "So the new task creation flow is a two-step process instead of the current single long form. Step one captures the essential info — title, assignee, due date. Step two is optional for adding details, attachments, and tags."),
            ('Chris Martinez', 330, 360, "I really like the progressive disclosure approach. But should we offer a power user mode that shows everything on one screen? Some of our enterprise users create 20+ tasks per day."),
            ('Anna Johansson', 360, 385, "That's a great call. I can add a 'Quick Create' toggle in settings that switches to a single-screen compact form. It would default to off for new users."),
            ('Ben Walker', 385, 410, "For the attachments in step two, are we supporting camera capture in addition to file picker? That's been a highly requested feature."),
            ('Nina Patel', 410, 435, "Yes, let's include camera capture. Anna, make sure we account for the camera permission flow in the designs."),
            ('Anna Johansson', 435, 460, "Will do. I'll also add the permission denial state — what the user sees if they decline camera access and how they can enable it later from settings."),
            ('Chris Martinez', 460, 490, "Can we discuss the color system? I noticed the new designs use a different shade of blue than our current brand guidelines."),
            ('Anna Johansson', 490, 520, "Good eye. I'm proposing we update the mobile color palette slightly. The current blue doesn't pass WCAG AA contrast ratios on several background colors. The new shade maintains our brand feel while being fully accessible."),
            ('Nina Patel', 520, 550, "Accessibility is non-negotiable, so I support the color update. Let's make sure we update the style guide and notify the marketing team about the change."),
            ('Ben Walker', 550, 580, "I'll update the design tokens in our mobile component library to match the new palette. Should take about a day of work."),
            ('Chris Martinez', 580, 610, "Last thing — are we supporting dark mode from launch? Our web app doesn't have it yet but mobile users seem to expect it."),
            ('Anna Johansson', 610, 640, "I've designed both light and dark variants for all screens. Dark mode is ready to go. The color system uses semantic tokens so switching is straightforward."),
            ('Nina Patel', 640, 670, "Excellent work Anna. Let's plan to implement dark mode from day one on mobile — it'll actually set a nice precedent for bringing it to web later."),
            ('Ben Walker', 670, 700, "Agreed. With semantic tokens it's essentially free from an engineering standpoint. We just need to test thoroughly on both modes."),
            ('Nina Patel', 700, 730, "Great review everyone. Anna, can you finalize the Figma file with the changes we discussed? I'd like to start engineering handoff next Monday."),
            ('Anna Johansson', 730, 755, "I'll have everything updated by Thursday. I'll also prepare a detailed engineering handoff document with all the specs, assets, and interaction notes."),
            ('Nina Patel', 755, 780, "Perfect. Thanks team, this is shaping up to be a fantastic redesign. Let's reconvene next week for the engineering kickoff."),
        ]
        for i, (speaker, start, end, content) in enumerate(segments):
            TranscriptSegment.objects.create(meeting=meeting, speaker_name=speaker, start_time=start, end_time=end, content=content, segment_order=i)

        MeetingSummary.objects.create(
            meeting=meeting,
            overview="Design review for the mobile app redesign covering three major user flows: navigation (bottom tab bar replacing hamburger menu), home feed (card-based layout with lazy loading), and task creation (two-step progressive disclosure with power user mode). Key decisions: dark mode from launch, updated color palette for WCAG AA compliance, camera capture support for attachments, skeleton screens for loading states. Engineering handoff planned for next Monday.",
            key_topics='["Navigation Redesign", "Home Feed Cards", "Task Creation Flow", "Dark Mode", "Accessibility", "Performance Optimization", "Engineering Handoff"]',
            outline="## Navigation Redesign\n- Bottom tab bar replacing hamburger menu\n- Top 5 most-used features surfaced\n- Swipe gestures deferred to V2\n- Based on user research (78% struggled with old nav)\n\n## Home Feed\n- Card-based layout (replaced list view)\n- Preview images, metrics, quick actions\n- Lazy loading + thumbnails for performance\n- Skeleton screens for loading states\n\n## Task Creation\n- Two-step progressive disclosure\n- Step 1: Title, assignee, due date\n- Step 2: Details, attachments, tags (optional)\n- Power user 'Quick Create' mode (single screen)\n- Camera capture support added\n\n## Visual Design\n- Updated blue palette for WCAG AA compliance\n- Dark mode designed and ready for launch\n- Semantic color tokens for easy theme switching\n\n## Next Steps\n- Figma updates by Thursday\n- Engineering handoff document\n- Engineering kickoff next Monday"
        )

        action_items = [
            ('Finalize Figma file with skeleton screens and camera permission flows', 'Anna Johansson', False),
            ('Prepare engineering handoff document with specs and assets', 'Anna Johansson', False),
            ('Update mobile design tokens to new color palette', 'Ben Walker', False),
            ('Add Quick Create toggle option to task creation designs', 'Anna Johansson', False),
            ('Notify marketing team about updated brand colors', 'Nina Patel', False),
        ]
        for title, assignee, completed in action_items:
            ActionItem.objects.create(meeting=meeting, title=title, assignee=assignee, is_completed=completed)

    # Meeting 5: Weekly Team Standup
    def _seed_meeting_5(self):
        meeting = Meeting.objects.create(
            title='Weekly Team Standup',
            date=timezone.now() - timedelta(hours=5),
            duration_seconds=900,
            meeting_type='standup'
        )

        participants = [
            ('James Wilson', 'james@company.com', '#7C3AED'),
            ('Sofia Ramirez', 'sofia@company.com', '#3B82F6'),
            ('Kai Nakamura', 'kai@company.com', '#EF4444'),
            ('Aisha Patel', 'aisha@company.com', '#10B981'),
            ('Luke Anderson', 'luke@company.com', '#F59E0B'),
            ('Maria Costa', 'maria@company.com', '#EC4899'),
        ]
        for name, email, color in participants:
            MeetingParticipant.objects.create(meeting=meeting, name=name, email=email, avatar_color=color)

        segments = [
            ('James Wilson', 0, 15, "Good morning everyone! Let's do our weekly standup. Quick updates — what you accomplished, what's next, and any blockers. Sofia, you're up first."),
            ('Sofia Ramirez', 15, 40, "This week I finished the user authentication refactor. All tests are passing and the code review is done. Next week I'm starting on the API rate limiting feature."),
            ('Sofia Ramirez', 40, 55, "One blocker — I need access to the production monitoring dashboard to set up rate limit alerts. Can someone grant me access?"),
            ('James Wilson', 55, 70, "I'll get you that access today. Kai, how about you?"),
            ('Kai Nakamura', 70, 95, "I completed the database migration for the new analytics schema. Took longer than expected because we had some edge cases with legacy data formats."),
            ('Kai Nakamura', 95, 115, "Next week I'm building the analytics aggregation pipeline. No blockers currently, but I might need some help from Aisha on the frontend visualizations."),
            ('Aisha Patel', 115, 140, "Happy to help! On my end, I shipped the redesigned settings page and fixed those three accessibility bugs from the audit. Really proud of the settings page — it looks fantastic now."),
            ('Aisha Patel', 140, 160, "Next week I'm working on the notification preferences UI. The designs are ready and I've already set up the component structure."),
            ('Luke Anderson', 160, 185, "This week was all about DevOps for me. I automated our staging deployment pipeline and set up the new monitoring stack — Grafana dashboards are now live."),
            ('Luke Anderson', 185, 210, "Next week I'm tackling the CI pipeline optimization. Our test suite takes 12 minutes and I think we can get it under 5 with parallelization."),
            ('Maria Costa', 210, 235, "I wrapped up the technical documentation for the API v2 endpoints. Also did a security review on the file upload system and found two medium-severity vulnerabilities."),
            ('Maria Costa', 235, 260, "I've already submitted patches for both vulnerabilities. Next week I'm focusing on the data encryption at rest implementation."),
            ('James Wilson', 260, 285, "Great work everyone. Those security patches — Maria, make sure those get fast-tracked through review. I don't want those sitting in the PR queue."),
            ('Maria Costa', 285, 305, "Already flagged them as high priority. Ryan from the security team is reviewing them today."),
            ('James Wilson', 305, 335, "Perfect. Quick announcement — the company all-hands is next Wednesday at 2 PM. There will be some exciting news about our Series B funding."),
            ('Sofia Ramirez', 335, 355, "Exciting! Also, quick shoutout to Luke for the Grafana dashboards. They've already helped me debug an issue this week."),
            ('James Wilson', 355, 380, "Love the team collaboration. Alright, that's a wrap. Have a great week everyone!"),
        ]
        for i, (speaker, start, end, content) in enumerate(segments):
            TranscriptSegment.objects.create(meeting=meeting, speaker_name=speaker, start_time=start, end_time=end, content=content, segment_order=i)

        MeetingSummary.objects.create(
            meeting=meeting,
            overview="Weekly standup covering team progress across engineering. Key accomplishments: authentication refactor completed, database migration for analytics done, settings page redesigned with accessibility fixes, staging deployment automated with Grafana monitoring, API v2 documentation finished, and two security vulnerabilities found and patched. Upcoming work includes API rate limiting, analytics pipeline, notification preferences UI, CI pipeline optimization, and data encryption at rest. Company all-hands next Wednesday with Series B funding news.",
            key_topics='["Authentication Refactor", "Analytics Migration", "Settings Redesign", "DevOps Automation", "Security Patches", "CI Pipeline", "Series B Announcement"]',
            outline="## Completed This Week\n- Auth refactor done, tests passing (Sofia)\n- Analytics DB migration complete (Kai)\n- Settings page redesign + 3 accessibility fixes (Aisha)\n- Staging deployment automation + Grafana dashboards (Luke)\n- API v2 documentation + security review (Maria)\n- 2 medium-severity vulnerabilities found & patched\n\n## Next Week Plans\n- API rate limiting feature (Sofia)\n- Analytics aggregation pipeline (Kai)\n- Notification preferences UI (Aisha)\n- CI pipeline optimization — target <5min (Luke)\n- Data encryption at rest (Maria)\n\n## Blockers\n- Sofia needs production monitoring dashboard access\n\n## Announcements\n- Company all-hands: Wednesday 2 PM\n- Series B funding news"
        )

        action_items = [
            ('Grant Sofia access to production monitoring dashboard', 'James Wilson', False),
            ('Fast-track security vulnerability patches through code review', 'Maria Costa', True),
            ('Coordinate with Aisha on analytics frontend visualizations', 'Kai Nakamura', False),
        ]
        for title, assignee, completed in action_items:
            ActionItem.objects.create(meeting=meeting, title=title, assignee=assignee, is_completed=completed)
