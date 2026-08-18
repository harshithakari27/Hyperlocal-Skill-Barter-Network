# Hyperlocal-Skill-Barter-Network

It's a website where people can teach each other skills -- things like guitar lessons, cooking, coding,
tutoring -- without paying money. Instead, everyone starts with a few free "credits." You earn credits by
teaching someone, and you spend credits when someone teaches you. The app matches people who live
near each other, so it's easy to actually meet up.

How Someone Actually Uses It ? :

Step 1 -- Creating an Account
A new user signs up with their name, email, and a password. The password is never stored as plain text --
it goes through a one-way scrambling process (called "hashing") before it's saved, so even I, looking
directly at the database, can't see anyone's actual password.
It's like shredding a document into confetti before filing it away. You can prove later
that a specific piece of confetti came from a specific document, but you can't turn the confetti back into
the original document.
When someone logs in, the app hands them a digital "pass" (called a token) that proves who they are.
Their browser holds onto that pass and shows it automatically every time they do something on the site, so
they don't have to log in again and again.

Step 2 -- Posting a Skill
A user fills out a form: what they can teach, a description, and how many credits per hour it costs. The app
also asks their browser for their location (with permission), and shows a small map where they can click to
fine-tune exactly where they are.

Step 3 -- Browsing Nearby Skills
When someone opens the "Browse" page, the app asks their location, then asks the database: "show me
every skill posted within 10 kilometers of here, closest first." The database can answer that instantly
because every listing's location is specially indexed for exactly this kind of search -- it doesn't have to
check every single listing in the whole database one by one.
It's the same trick a food delivery app uses to show you nearby restaurants instead of
every restaurant on Earth.
Results show up both as a scrollable list and as pins on an actual interactive map.

Step 4 -- Requesting to Learn Something
If a listing looks interesting, the user clicks "Request." This creates a pending request that the original
poster can see. They can Accept or Reject it. The app also stops someone from requesting their own
posted skill -- that check happens on the server, not just hidden in the app's buttons, so it can't be tricked.

Step 5 -- Chatting in Real Time
Once a request is accepted, both people get access to a private chat for that specific match. Messages
appear instantly on both sides -- no need to refresh the page -- using a technology called Socket.io, which
keeps a live, always-open connection between the browser and the server.
Regular web pages work like sending letters back and forth -- you ask a question, wait,
get an answer. Socket.io is more like a walkie-talkie: the line stays open, so messages arrive the instant
they're sent, in both directions. Each match gets its own private "channel," so one conversation never
leaks into another's.

Step 6 -- Completing the Exchange
After the lesson actually happens, either person can click "Mark Complete." At that moment, credits move
automatically: the learner's balance goes down by the agreed rate, and the teacher's balance goes up by
the same amount. This happens as one safe, uninterruptible database operation, so there's no way for the
transfer to get stuck halfway or duplicate.

Step 7 -- The Dashboard
Every user gets a personal dashboard showing how many skills they've posted, their current credit
balance, and two charts: what categories of skills they've posted, and how their match requests have gone
(pending, accepted, completed, etc). The charts are built live from real data in the database, not
hardcoded.
