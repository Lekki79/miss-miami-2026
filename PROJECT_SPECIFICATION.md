# PROJECT_SPECIFICATION

**Version:** 1.0  
**Status:** Approved  
**Date:** 23 July 2026

**Source:**  
Approved Customer Requirements  
(Stage I + Stage II)

## 1. Document authority

`PROJECT_SPECIFICATION` is the official and primary architectural document of the Miss Miami project.

It has priority when making:

- architectural decisions;
- product decisions;
- UX decisions;
- project decisions;
- technical decisions.

The approved Customer Requirements are the primary source of project requirements. If the current implementation, source code, interface, prototype, previous document, or earlier technical decision conflicts with the approved Customer Requirements or this specification, the approved Customer Requirements and this specification take priority.

Before performing any subsequent task, the team must review `PROJECT_SPECIFICATION`.

If a contradiction is found between the current code and this specification, the team must:

1. report the contradiction;
2. explain its impact on the platform;
3. present possible solutions with their benefits, disadvantages, and risks;
4. wait for approval;
5. not change the architecture or approved behavior independently.

Stage I and Stage II are equally approved parts of the project:

- Stage I establishes and launches the platform foundation;
- Stage II extends that foundation with the approved additional functionality.

Stage II is not unknown, optional, or unapproved future scope. Stage I must not be implemented in a way that requires a complete system rebuild for Stage II.

## 2. Platform purpose

Miss Miami is a scalable digital competition platform, not only a public beauty pageant website.

The platform must provide a unified digital environment for:

- contestants;
- organizers;
- sponsors;
- viewers;
- CRM operations;
- email communications;
- payments;
- competition processes;
- content and media;
- future iOS and Android applications.

The public website is one interface of the platform. It must not become the sole location of business logic or the authoritative storage of platform data.

## 3. Mandatory architectural principles

### 3.1. Unified domain model

The public website, Contestant Portal, Organizer Dashboard, CRM, backend, iOS application, and Android application must use the same domain model.

The model must be capable of representing at least:

- User;
- Contestant;
- Application;
- Application Status;
- Document;
- Media Asset;
- Payment;
- Road to the Crown Step;
- Contestant Task;
- Vote;
- Promo Code;
- Sponsor;
- Sponsor Package;
- Ticket;
- Email Event;
- Notification;
- Publication;
- Competition Event;
- Winner;
- Judge;
- Testimonial;
- Product;
- Order;
- Affiliate Partner.

Separate incompatible data models must not be created for Apply, Contestant Portal, Organizer Dashboard, CRM, or future mobile applications.

### 3.2. Unified backend and API

Future platform clients must work through one backend/API and one authoritative data model:

```text
Public Website
Contestant Portal
Organizer Dashboard
CRM
iOS Application
Android Application
        ↓
Unified Backend / API
        ↓
Unified Data Model
```

Web-only implementation details must not prevent the same platform capabilities from being reused by iOS and Android applications.

### 3.3. Business logic separation

Business rules must not be inseparably tied to individual HTML pages.

This includes:

- eligibility and age rules;
- required application fields;
- file and document requirements;
- payment rules;
- application statuses and status transitions;
- Road to the Crown access and progress;
- voting rules;
- promo-code rules;
- sponsor-package rules;
- role and permission rules;
- email automation events.

Client-side validation improves UX but does not replace backend validation.

### 3.4. Functional-area separation

Every new requirement must first be assigned to one or more functional areas:

- Public Website;
- Contestant Portal;
- Organizer Dashboard;
- CRM;
- Backend;
- Integrations;
- Future Mobile Applications.

Public content, contestant functionality, organizer functionality, CRM operations, and backend responsibilities must not be mixed merely to simplify a local page implementation.

### 3.5. Platform-wide decision assessment

Before developing any module, the team must evaluate its effect on:

- Stage I;
- Stage II;
- the Contestant Portal;
- the Organizer Dashboard;
- CRM;
- the future backend/API;
- iOS;
- Android;
- security;
- project ownership and handover.

The required control question is:

> Does this help build the Miss Miami platform, or does it solve only a local page problem at the cost of future rework?

If a solution complicates Stage II or future mobile applications, development must stop until an alternative is reviewed and approved.

### 3.6. Current technology constraint

The current HTML/CSS/JavaScript project remains the active implementation base.

A complete migration to React, Next.js, or another platform is not part of current work unless approved as a separate architectural task.

Keeping the current stack does not remove the requirements to:

- separate business rules;
- prepare a unified data model;
- support a future API;
- avoid incompatible page-specific models;
- keep integrations replaceable and transferable.

## 4. Requirement statuses

The following statuses are used:

- **Not started** — implementation is absent.
- **In development** — a partial interface, prototype, or incomplete implementation exists.
- **Implemented** — the approved scope is implemented and verified.
- **Requires Customer materials** — implementation depends on content, files, credentials, or other materials from the Customer.
- **Requires separate approval** — the requirement is approved, but its detailed business rules, content, UX, or technical integration scenario still requires approval.

A requirement may have a primary implementation status and additional dependencies.

A static interface, placeholder, or demonstration scenario is not considered a completed backend capability.

## 5. Stage I — Platform development and launch

Stage I is the platform foundation.

### 5.1. Key capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Email campaigns and automated messages | Backend, CRM, Integrations | Email provider, events, templates | Not started | Sender account and approved email copy | Provider, events, timing |
| CRM client database | CRM, Backend | Unified contact and application model | Not started | CRM access if an external CRM is selected | Data scope and CRM implementation |
| Contestant registration | Public Website, Backend | Apply, identity, database | In development | Final registration structure | Fields and business rules |

### 5.2. Contestant capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Online application submission | Public Website, Backend | Application API and data model | In development; A8 is a demonstration prototype | Final fields and rules | Submission lifecycle |
| Photo and document upload | Public Website, Backend | Storage, validation, security | In development; client interface exists | Final file requirements | File types, limits, retention |
| Online registration fee payment | Backend, Integrations | Stripe, amount, refund rules | In development; demonstration only | Stripe account and payment data | Payment and failure scenarios |
| Personal Contestant Portal | Contestant Portal | Authentication, API, roles | In development; prototype exists | Final portal scenarios | Access and navigation |
| Application statuses | Contestant Portal, Organizer Dashboard, CRM | Unified application lifecycle | In development; prototypes are not connected by one model | Approved statuses | Transitions and permissions |
| Road to the Crown, 8 steps | Contestant Portal | Status, content, progress model | In development; prototype exists | Approved content for all 8 steps | Access and completion rules |
| FAQ with competition rules | Public Website, Contestant Portal | Final competition rules | In development; current content is temporary | Approved rules and answers | Final wording |

### 5.3. Sponsor capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Downloadable Sponsor Deck PDF | Public Website | Approved PDF | Requires Customer materials | Final Sponsor Deck | Final version |
| Gold, Platinum, and Title Sponsor package page | Public Website | Package content and pricing | In development; current page is temporary | Descriptions, prices, benefits | Final package structure |
| Become a Sponsor form without online payment | Public Website, Backend, CRM | Form storage and notifications | In development; current interface is temporary | Recipient and required data | Submission workflow |

### 5.4. Competition capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Competition schedule | Public Website | Approved dates and events | Requires Customer materials | Full schedule | Publication approval |
| Prizes | Public Website | Approved prize packages | Requires Customer materials | Prizes, placements, conditions | Publication approval |
| Beauty with Purpose | Public Website | Approved mission and content | In development | Final text and media | Final content |

### 5.5. Brand capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Media Kit | Public Website | Brand materials | Not started | Media Kit, logo, brand assets | Final content |
| Press section | Public Website | Press materials and contacts | Not started | Copy, publications, contacts | Structure and content |
| News and Blog | Public Website, future Backend | Publication model | Not started | Content and editorial rules | Publishing workflow |
| Photo and video gallery | Public Website | Final media assets | In development; current page is temporary | Photos and videos | Selection and captions |

### 5.6. Business capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| CRM | CRM, Backend | Contacts, applications, events | Not started | Access or CRM selection | CRM boundaries and data |
| Automated email sequences | CRM, Backend, Integrations | Email events and templates | Not started | Approved copy and sender | Triggers and timing |
| Promo codes | Backend, Organizer Dashboard, Stripe | Discount rules and validity | Not started | Business rules | Creation, limits, expiry |
| People's Choice voting | Public Website, Backend, Organizer Dashboard | Voting rules, protection, results | Not started | Approved voting rules | Eligibility, anti-fraud, visibility |
| Organizer Dashboard | Organizer Dashboard | Authentication, roles, API | In development; early prototype exists | Organizer workflows | Roles, permissions, actions |

### 5.7. SEO and editorial content

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Page SEO optimization | Public Website | Final URLs, copy, metadata | In development | Final content | Target search terms |
| Blog | Public Website, future Backend | Publication model | Not started | Content and structure | Publishing workflow |
| Four starter articles | Public Website | Approved articles and images | Requires Customer materials | Four articles and images | Final publication approval |

### 5.8. Legal and contact information

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| FAQ | Public Website | Approved answers | In development; current page is temporary | Final answers | Final content |
| Contacts | Public Website, Backend | Form recipient and email delivery | In development; current page is temporary | Contact details and email | Delivery workflow |
| Privacy Policy | Public Website, Legal | Approved legal text | Not started | Final legal document | Legal approval |
| Terms & Conditions | Public Website, Legal | Approved legal text | Not started | Final legal document | Legal approval |
| Refund Policy | Public Website, Legal, Payments | Approved payment rules | Not started | Final legal document | Legal and payment approval |
| Social media links | Public Website | Current URLs | In development | Final links | Publication approval |

### 5.9. Additional Stage I obligations

| Requirement | Functional area | Current status |
|---|---|---|
| Responsive design for desktop, tablet, and mobile | All web interfaces | In development; Home, About, and Apply have received dedicated mobile testing |
| Public website pages | Public Website | In development; Home, About, and Apply are reference pages, while remaining pages are temporary |
| Transfer of source code and project materials | Project handover | Mandatory under the approved requirements |
| Service accounts registered to the Customer | Infrastructure | Mandatory architectural and handover requirement |
| 365 days of technical support after Stage I launch | Maintenance | Begins after Stage I launch |

## 6. Stage II — Approved platform extension

Stage II is approved scope and must be considered during Stage I architecture and data-model decisions.

### 6.1. Sponsor capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Sponsor registration | Public Website, Backend, CRM | Sponsor entity, account or application model | Not started | Required sponsor data | Registration workflow |
| Online sponsor package payments | Backend, Stripe, CRM | Packages, prices, Stripe | Not started | Prices, Stripe, payment terms | Payment workflow |

### 6.2. Viewer capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Miss Miami news subscription | Public Website, CRM, Integrations | Email provider and consent model | Not started; only a UI placeholder exists | Provider and consent copy | Subscription workflow |
| Online ticket sales | Public Website, Backend, Payments | Ticket model and payment provider | Not started | Ticket types, prices, rules | Sales and refund workflow |
| Countdown to the finale | Public Website | Approved finale date and time | Not started | Finale date and time | Display rules |
| Merch online store | Public Website, Backend, Payments | Catalog, orders, delivery | Not started | Products, prices, shipping rules | Store workflow |

### 6.3. Competition capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Winners gallery | Public Website | Winner entity, photos, biographies | Requires Customer materials; hidden UI preparation is not implementation | Photos, years, titles, biographies | Final publication approval |
| Judge profiles | Public Website | Judge entity | Not started | Photos, names, biographies | Final publication approval |

### 6.4. Brand and business capabilities

| Requirement | Functional area | Dependencies | Current status | Customer materials | Separate approval |
|---|---|---|---|---|---|
| Contestant testimonials | Public Website | Testimonial entity and publication consent | Not started | Copy, names, photos, consent | Final publication approval |
| Affiliate program | Backend, CRM, Organizer Dashboard | Partners, attribution, links, payments | Not started | Commercial program rules | Attribution and payout rules |

## 7. Stage II impact on Stage I architecture

Stage I implementation must already allow for:

- extension of `User` to contestant, organizer, sponsor, and administrator roles;
- dedicated `Sponsor` and `SponsorPackage` entities;
- future `Ticket`, `Order`, `Product`, and `AffiliatePartner` entities;
- a reusable payment model for registration fees, sponsor packages, tickets, and merchandise;
- a reusable publication model for News, Blog, Press, and Media;
- dedicated `Winner`, `Judge`, and `Testimonial` entities;
- email consent and communication preferences;
- centralized roles and permissions;
- an API reusable by Web, iOS, and Android;
- business rules independent of individual HTML pages.

## 8. Current public website state

### 8.1. Reference pages

The approved reference pages for the new design, quality, and UX are:

- Home — `index.html`;
- About — `about.html`;
- Apply — `apply.html`.

### 8.2. Temporary pages and prototypes

The following current pages are not considered final implementations:

- Competition;
- Gallery;
- Sponsors;
- FAQ;
- Contact;
- Contestant Portal / Dashboard;
- Organizer / Admin.

Their existence does not mean the related platform requirement is complete.

### 8.3. Apply

Apply is the most developed interactive prototype.

Currently confirmed:

- client-side form interface;
- client-side validation;
- upload controls;
- custom Date Picker;
- demonstration submission flow;
- demonstration success screen;
- iPhone Safari adaptations.

The following remain temporary:

- actual application submission;
- backend validation;
- persistent file upload;
- real payment;
- CRM record creation;
- email delivery;
- backend-generated Application ID.

## 9. Customer materials and decisions

The team must never invent missing Customer content or business rules.

The following are expected or require final confirmation:

- final vector logo;
- final photographs and videos;
- competition dates;
- schedule;
- prizes;
- competition rules;
- age and eligibility restrictions;
- selection and judging criteria;
- final registration structure;
- final validation rules;
- photo, video, and document requirements;
- registration fee;
- Stripe account and payment details;
- refund rules;
- Road to the Crown content;
- sponsor package descriptions and prices;
- Sponsor Deck;
- Media Kit;
- press materials;
- articles;
- legal documents;
- social media links;
- sender email;
- automated email copy;
- promo-code rules;
- People's Choice rules;
- Affiliate rules;
- merchandise products, prices, and shipping;
- ticket types and prices;
- winner information;
- judge information;
- testimonials and publication consent.

Until approved materials are received, the implementation must use clearly identified placeholders or mark the corresponding section as awaiting Customer materials.

## 10. Security, ownership, and handover

Mandatory requirements:

- authentication and roles are enforced by the backend;
- all input is validated again by the backend;
- user content is rendered safely;
- database, Storage, and API security rules are version controlled;
- secret keys are not stored in client-side code;
- payments are confirmed through secure server-side processes and provider webhooks;
- voting is protected by backend rules;
- contestant personal data is restricted to authorized roles;
- all service accounts are registered to the Customer;
- the project must not depend on developers' personal accounts;
- source code, materials, settings, and access credentials are transferred according to the approved requirements.

## 11. Permanent project maintenance rules

1. Always preserve the product context and platform objective.
2. Do not change approved behavior without Customer approval.
3. Do not invent product, architectural, UX, content, or business requirements.
4. If information is insufficient, request clarification before making a consequential decision.
5. Before a substantial change, explain the problem, present options, evaluate benefits, disadvantages, and risks, and wait for approval.
6. Warn in advance if a task can affect other pages or functionality.
7. Do not automatically fix unrelated architectural issues; record confirmed issues in `TECH_DEBT.md`.
8. If multiple implementations are valid, present the alternatives before choosing.
9. Clearly identify temporary solutions, explain their reason, and record them in `TECH_DEBT.md`.
10. Report contradictions between new requirements and existing behavior before changing the implementation.
11. Do not change project priorities independently.
12. Quality, stability, and regression prevention take priority over speed.
13. Do not use solutions that make project handover difficult or depend on personal developer accounts.
14. After every completed task, report:
    - what was done;
    - which files changed;
    - whether side effects exist;
    - what should be checked manually;
    - whether confirmed technical debt was added.

## 12. Team workflow

Each task follows this process:

1. **Task** — the Customer defines the requested outcome.
2. **Specification review** — the team checks `PROJECT_SPECIFICATION`.
3. **Functional-area classification** — the requirement is assigned to Public Website, Contestant Portal, Organizer Dashboard, CRM, Backend, Integrations, or Future Mobile Applications.
4. **Understanding** — the developer states how the task is understood.
5. **Plan** — expected files, actions, dependencies, and risks are identified.
6. **Platform impact review** — impact on both stages, CRM, portals, backend/API, iOS, and Android is assessed.
7. **Options** — valid implementation alternatives and trade-offs are presented.
8. **Approval** — substantial changes wait for Customer confirmation.
9. **Implementation** — only the approved scope is changed.
10. **Verification** — testing is proportional to risk and includes regression checks.
11. **Report** — changed files, results, side effects, and manual checks are reported.
12. **Documentation** — `PROJECT_SPECIFICATION` or `TECH_DEBT.md` is updated only when the applicable approval and documentation rules are satisfied.

## 13. Specification Freeze

After approval of `PROJECT_SPECIFICATION`, changes are permitted only when:

- the approved Customer Requirements have changed;
- a separate architectural decision has been approved;
- a contradiction has been discovered within the specification.

The specification must not be changed merely because a new idea has appeared.

New ideas:

- are recorded separately;
- do not change the approved project scope;
- do not affect architecture or priorities;
- do not become part of the project until approved by the Customer.

Every change to `PROJECT_SPECIFICATION` must include:

- the reason for the change;
- the date of the change;
- a reference to the Customer decision or approved architectural decision.

