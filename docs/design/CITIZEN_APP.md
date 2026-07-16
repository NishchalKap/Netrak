# Netrak Citizen App

> Design direction document. The implemented v1.0 scope and integration limitations are defined in `docs/release-scope.md`.

## Experience promise

The citizen experience answers “Am I safe?” before presenting technical detail. It should feel like a trusted financial product: private, direct, and composed.

## Home hierarchy

1. Personal greeting.
2. Current protection/threat level in plain language.
3. One dominant “Report suspicious activity” action.
4. Emergency SOS as a clearly separated secondary action.
5. Active cases and recent updates.
6. One actionable threat advisory.
7. Evidence reminder only when relevant.

## Report flow

Use a guided sequence: incident type → details → evidence → review → submitted. Save progress locally where possible. Never force a citizen to understand law-enforcement classifications before reporting.

## Cases

Case detail includes readable status, case ID in mono, timeline, evidence gallery, assigned authority where available, and next expected action. Avoid claiming investigation outcomes before they are returned by the API.

## Notifications

Group by today, this week, and earlier. Threat alerts lead with practical advice; case alerts explain what changed and whether action is needed.

## Safety language

Use: “You can pause before acting.” “Do not share your OTP.” “Help is available.”

Avoid: “You have been hacked.” “Guaranteed safe.” “Instant recovery.”
