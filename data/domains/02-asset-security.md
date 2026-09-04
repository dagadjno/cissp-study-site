# Domain 2: Asset Security

## Data security controls (2.6)
- Definition (ISC2 framing): selecting protection for data based on **what state it is in** and **which baseline controls actually apply** to the system — control selection, not detection tooling [ISC2 outline]
- Key facts:
  - **Data states** — the state determines the mechanism [OSG glossary]:

  | State | Definition | Primary protection |
  | --- | --- | --- |
  | **Data at rest** | Stored statically on a storage device (aka data on storage) | Disk/file/database encryption, access controls |
  | **Data in transit** | Communicated over a network (aka in motion, on the wire, in transfer) | **TLS**, IPsec/VPN |
  | **Data in use** | Actively processed by an application (aka in processing) | Session access control, memory protection / secure enclaves |

    - **Data in use is the hardest state to protect** — it must be decrypted to be processed [unverified]
  - **Scoping and tailoring** — **scoping is part of tailoring**, not a coordinate step [OSG glossary]:
    - **Tailoring** = modifying the list of controls within a baseline to align with the organization's mission
    - **Scoping** = the part of tailoring that reviews the baseline and selects only controls that apply to the systems being protected
    - SP 800-53B tailoring actions [NIST SP 800-53B]:
      1. Identify and designate **common controls** (inherited once, used by many systems)
      2. Apply **scoping considerations** (eliminate unnecessary controls from the initial baseline)
      3. Select **compensating controls** (a baseline control tailored out by necessity, but its protection still needed)
      4. Assign values to **control parameters** (organization-defined blanks)
      5. **Supplement** the baseline with additional controls as needed
      6. Provide information for **control implementation**
    - Baselines: **low / moderate / high** impact, plus a **privacy baseline applied regardless of impact level** [NIST SP 800-53B]
    - Compensating controls are chosen when the baseline control is **technically infeasible, not cost-effective, or harms the mission** [NIST SP 800-53B]
  - **Standards selection**: driven by data type + jurisdiction + contract, not preference — cardholder data -> **PCI DSS** (contractual, not law), PHI -> **HIPAA**, EU personal data -> **GDPR**, federal systems -> NIST SP 800-53/**FedRAMP**, certifiable ISMS -> **ISO 27001** [ISC2 outline]. Same matching exercise as the D1 legal/regulatory entry, applied at the data layer
  - **Data protection methods** [OSG glossary]:

  | Method | What it does | Where it acts |
  | --- | --- | --- |
  | **DRM** (digital rights management) | Uses encryption to enforce copyright/usage restrictions on digital media | Travels **with the object** — persists after the file leaves your control |
  | **DLP** (data loss prevention) | Detects and prevents unauthorized access to, use of, or transmission of sensitive info (**exfiltration**); network-based and endpoint-based | Egress paths / boundary |
  | **CASB** (cloud access security broker) | Security **policy enforcement point** between cloud consumers and cloud providers; on-premises or cloud-based | Between users and cloud services |

    - CASB **four pillars** (Gartner framing ISC2 follows): **visibility** (shadow-IT discovery), **compliance**, **data security**, **threat protection** [Gartner]
- Exam traps / distractors:
  - **DRM vs. DLP** — the recurring pair: protection that must survive *after* a file leaves your control (partner downloads it) -> **DRM**; stopping it from leaving at all -> **DLP**
  - **Shadow IT / unsanctioned SaaS discovery** in a stem = giveaway cue for **CASB**
  - **Scoping presented as separate from tailoring** = wrong; scoping is one tailoring action among six
  - **Tailoring is not "weakening the baseline"** — it is justified alignment to mission, with compensating controls where a control is removed by necessity
  - State-to-control mismatch: "the database is encrypted, so data **in use** is protected" — at-rest encryption does nothing for data already decrypted in memory; TLS protects in transit and nothing on either endpoint
  - Domain framing shift: on the job DLP/CASB are **alert sources**; on the exam they are **control-selection answers** — a stem asking "which control" is not asking how to investigate
- Related terms: security documentation hierarchy (baselines, D1), security control types (compensating, D1), legal and regulatory landscape (standards selection, D1), data lifecycle/remanence (2.4), asset classification (2.1)
- Sources: [OSG glossary], [NIST SP 800-53B], [ISC2 outline], [Gartner], [unverified]

## Data remanence and destruction methods (2.4)
- Definition (ISC2 framing): **data remanence** = residual data left on media after a delete — **erasing** removes only the directory/catalog link, the actual data remains on the drive [OSG glossary]. Destruction method is chosen by **media type + data classification + whether the media leaves organizational control** [NIST SP 800-88]
- Key facts:
  - ISC2 terminology ladder [OSG glossary]:

  | Term | What it does |
  | --- | --- |
  | **Erasing** | Delete operation; removes only the directory/catalog link — data remains |
  | **Clearing** (aka **overwriting**) | Overwrites with new data; for media **reused in the same secured environment** |
  | **Purging** | Sanitization technique that "typically involved multiple overwrites" to prevent recovery |
  | **Degaussing** | Magnet/magnetic field destroys data on **magnetic media**; on modern high-capacity drives the field needed may damage the drive |
  | **Sanitization** | Umbrella term: any processes ensuring data cannot be recovered by any means; can be done by purging or degaussing **without** physically destroying media |
  | **Declassification** | Assigning a **lower classification** as value depreciates — not destruction |
  | **Cryptographic erasure** (**cryptoshredding**) | Destroys the **encryption keys**; does not erase or clear the data itself |

  - **NIST SP 800-88 Rev. 1** three sanitization categories [NIST SP 800-88]:

  | Category | Definition |
  | --- | --- |
  | **Clear** | Logical techniques across all **user-addressable** storage locations; protects against **simple non-invasive** recovery. Typically standard Read/Write commands, or factory reset where rewriting isn't supported |
  | **Purge** | Physical or logical techniques rendering target data recovery **infeasible using state-of-the-art laboratory techniques** |
  | **Destroy** | Same infeasibility **plus** subsequent inability to use the media for storage |

    - Selection drivers: data confidentiality, media type, whether media stays under organizational control, final disposition [NIST SP 800-88]
    - **Cryptographic Erase (CE)**: sanitizes the encryption key rather than the storage locations, leaving only ciphertext; fast, supports partial sanitization — requires the data to have been encrypted as stored [NIST SP 800-88]
  - **How it works vs. how ISC2 frames it** — genuine divergence, know both:
    - **ISC2/OSG (exam answer)**: purging "typically involved **multiple overwrites**" [OSG glossary]
    - **NIST SP 800-88 (reality)**: for magnetic media a **single overwrite pass** with a fixed pattern (e.g., binary zeros) typically hinders recovery *even against state-of-the-art laboratory techniques*; multi-pass DoD 5220.22-M folklore is obsolete [NIST SP 800-88]
  - Media-specific mechanics [NIST SP 800-88]:
    - **Degaussing should never be solely relied upon for flash memory-based storage devices**, or for magnetic devices that also contain non-volatile non-magnetic storage
    - Degaussing a magnetic disk **typically renders it permanently unusable** — not a "sanitize for reuse" option
    - Degaussing renders a legacy magnetic device *Purged* only when degausser strength is matched to media **coercivity** (check the manufacturer, not the label)
    - Native Read/Write overwrite **misses areas not mapped to active LBA** (Logical Block Addressing) — defect areas, unallocated space; dedicated sanitize commands address these
    - **Verification must be performed for each Clear and Purge technique except degaussing**, whose assurance depends on degausser selection and periodic spot checks
    - Destructive techniques (incineration, shredding, disintegrating, pulverizing, degaussing) also render a device Purged; **bending, cutting, and shooting a hole through a drive may leave portions recoverable**
  - Documentation: sanitization records capture the **method used** (degauss, overwrite, block erase, crypto erase, etc.) — the certificate-of-sanitization trail for media leaving the org [NIST SP 800-88]
- Exam traps / distractors:
  - **Degaussing an SSD** — the single most common wrong answer here; no magnetic domains to disturb
  - **"We formatted/deleted it"** = remanence remains; formatting is not sanitization
  - Media **reused in the same secure environment -> Clear**; media **leaving organizational control -> Purge or Destroy**
  - **Failed/unwritable drive -> Destroy** — you cannot overwrite media you cannot write to
  - **Declassification vs. destruction**: declassification lowers the classification level, it does not remove data
  - **Crypto erase** answers are wrong unless the stem establishes the data was encrypted at rest to begin with
  - Degaussing offered as a *reuse* option for HDDs — it typically destroys the drive
- Related terms: data security controls (2.6, data states), data lifecycle/retention (2.4), asset classification (2.1), EOL/EOS (2.5), evidence handling/chain of custody (D1 1.5)
- Sources: [OSG glossary], [NIST SP 800-88], [ISC2 outline]

## Data and asset classification (2.1)
- Definition (ISC2 framing): **classification** = (1) a label applied to a resource indicating its **sensitivity or value**, designating the level of security needed to protect it; (2) the **process** of labeling **objects with sensitivity labels** and **subjects with clearance labels** [OSG glossary]. **Data classification** = grouping data under labels in order to apply security controls and access restrictions [OSG glossary]
- Key facts:
  - **Government/military scheme** — 5 levels, highest to lowest [OSG glossary]; damage language per **Executive Order 13526** (signed **2009-12-29**, Classified National Security Information) [EO 13526]:

  | Level | Unauthorized disclosure causes |
  | --- | --- |
  | **Top Secret** | **Exceptionally grave damage** to national security |
  | **Secret** | **Serious damage** to national security |
  | **Confidential** | **Damage** to national security / noticeable effects |
  | **Sensitive But Unclassified (SBU)** | Internal or office use only; often protects individuals' **privacy rights** |
  | **Unclassified** | Neither sensitive nor classified; no compromise of confidentiality, no noticeable damage |

    - **"Classified"** = collective label for anything ranked **above SBU** (Confidential, Secret, Top Secret) [OSG glossary]
  - **Commercial/private sector scheme** — 4 levels, highest to lowest [OSG glossary]:

  | Level | Nature of the data | Impact if disclosed |
  | --- | --- | --- |
  | **Confidential** (aka **Proprietary**) | Internally valuable and sensitive; may be proprietary or **trade secret**; proprietary = owned exclusively, disclosure hits the **competitive edge** | **Significant damage** |
  | **Private** | **Personal/personnel** nature, internal use only | **Significant negative** impact to company **or individuals** |
  | **Sensitive** | More valuable than public, but **organizationally related rather than personnel-related**; aka **FIUO** (for internal use only) / **FOUO** (for office use only) | **Modest but still negative** |
  | **Public** | All data not fitting a higher class; not readily disclosed | Should **not** be seriously negative |

  - **Private vs. Sensitive** (commercial) discriminator = **what the data is about**: personnel/personal -> **Private**; organizational -> **Sensitive**. Impact wording differs too (significant vs. modest) [OSG glossary]
  - The two schemes **do not map 1:1**; they share the word **Confidential**, which sits at opposite ends of each (see traps)
  - **Numeric "class N" labels are not ISC2 vocabulary** — the exam uses the names, and no numbering appears in the glossary (which uses "classification level" only as a synonym for **security label**) [OSG glossary]. Numbers in study-material comparison tables are a **relative-ordering device** (higher = more sensitive), and aligning the two schemes by number is lossy: 5 government levels forced into 4 rows squeezes out **SBU**. Real-world numeric tiers (Tier 1/2/3, Level 1-4) are **organization-invented and inconsistent in direction** — some count 1 as most sensitive, others as least [unverified]
  - Mechanism:
    1. The **data owner** assigns classification (custodian implements, does not decide) — cross-ref data roles (2.4)
    2. Objects receive **sensitivity labels**; subjects receive **clearance labels** [OSG glossary]
    3. Access requires **clearance >= classification** *plus* **need-to-know** — clearance alone is insufficient
    4. Handling requirements, controls, and destruction method all follow from the label
    5. **Declassification** = assigning a lower level as value depreciates (see destruction entry) [OSG glossary]
  - **Classification level** = another term for a **security label**; an assigned importance/value placed on objects and subjects [OSG glossary]
  - **Asset classification**: a system or item of media inherits the classification of the **highest-classified data** it stores or processes — a laptop handling Secret data is a Secret asset, and its disposal follows Secret rules [unverified]
- Exam traps / distractors:
  - **"Confidential" collides across schemes** — **highest** commercial level vs. the **lowest classified** government tier (above SBU). A stem using the word without naming the scheme is testing exactly this
  - Don't reason from a **numeric alignment** ("both are class 3") — sharing a table row is not equivalence, and it is what produces the Confidential collision above
  - **Private vs. Sensitive** — personnel/personal vs. organizational; the most-missed commercial pair
  - **Classification vs. categorization**: **FIPS 199** categorizes federal **systems** as low/moderate/high impact from worst-case C/I/A loss — a different axis from TS/S/C classification; both use tiered labels, which is why they pair as distractors (cross-ref RMF entry, D1)
  - "Who classifies the data?" -> **data owner**, never the custodian or the security team
  - **Clearance >= classification is necessary but not sufficient** — **need-to-know** is the second gate
  - **Over-classification is a failure mode**, not a safe default: protection costs money and over-restriction impedes work [unverified] — verify in the OSG asset security chapter
- Related terms: data security controls (2.6), data remanence and destruction (2.4, declassification), data roles (2.4), FIPS 199/RMF (D1), MAC and Bell-LaPadula (D3/D5, labels and clearances), sensitive data types (next entry)
- Sources: [OSG glossary], [EO 13526], [ISC2 outline], [unverified]

## Sensitive data types - PII, PHI, proprietary (2.1)
- Definition (ISC2 framing): **two conflicting uses of the same word** — know which one the question wants:
  - **Umbrella sense**: "sensitive information" = any data that isn't public/unclassified; canonical categories are **PII**, **PHI**, and **proprietary data** [unverified — verify the triad framing in the OSG asset security chapter]
  - **Label sense**: **Sensitive** as the specific commercial classification tier, which the glossary defines as *"more organizationally related than personnel-related"* [OSG glossary] — under this sense PII/PHI classify as **Private**, not Sensitive (see classification entry)
- Key facts:
  - **PII** (personally identifiable information):
    - [OSG glossary]: any data item that can be **easily and/or obviously traced back** to the person of origin or concern
    - [NIST SP 800-122] (the precise version): (1) information that can **distinguish or trace** an individual's identity — name, SSN, date/place of birth, mother's maiden name, biometric records; **and** (2) any other information **linked or linkable** to an individual — medical, educational, financial, employment information
    - **Linked vs. linkable** [NIST SP 800-122]: **linked** = secondary source on the same or closely-related system with no controls segregating them; **linkable** = obtainable more remotely (unrelated internal system, public records, search engine). Consequence: a field that identifies nobody on its own **becomes PII** once something else makes it linkable
  - **PHI** (protected health information):
    - [OSG glossary]: data relating to health status, use of healthcare, payment for healthcare, and other information collected about an individual in relation to their health
    - [45 CFR 160.103]: individually identifiable health information **transmitted or maintained by a covered entity or business associate**, in any form or medium. Health data held outside that relationship (e.g., a consumer fitness app) is health information but **not HIPAA-regulated PHI**
    - **De-identification** — exactly two permitted methods [45 CFR 164.514]:

  | Method | Requirement |
  | --- | --- |
  | **Safe Harbor** (164.514(b)(2)) | Remove **18 specified identifiers** + no actual knowledge the remainder could identify someone |
  | **Expert determination** | A qualified expert documents that re-identification risk is **very small** |

    - Safe Harbor's 18 identifiers include names, geographic subdivisions **smaller than a state**, all **dates except year**, phone/fax, email, SSN and medical record numbers, account/certificate numbers, vehicle and device identifiers, URLs, **IP addresses**, biometric identifiers, and full-face photos [45 CFR 164.514]
  - **Proprietary data**: commercial/private-sector confidential information owned exclusively by the organization; disclosure has drastic effects on the **competitive edge** [OSG glossary]
  - Masking/protection techniques [OSG glossary]:

  | Technique | What it does | Reversible? |
  | --- | --- | --- |
  | **Anonymization** | PII **removed** from the dataset (aka **de-identification**) | No — one-way |
  | **Pseudonymization** | Masks/obfuscates using **pseudonyms** standing in for real values | Yes, by design |
  | **Tokenization** | Masks/obfuscates using **tokens** (unique identifying symbols) representing the value | Yes, via the token vault |

- Exam traps / distractors:
  - **"Sensitive" umbrella vs. Sensitive tier** — "is this sensitive data?" -> yes for PII/PHI; "how should it be classified?" -> **Private** (personnel-related), not Sensitive
  - **PHI requires the covered-entity/business-associate relationship** — health data outside it isn't HIPAA PHI (pairs with HITECH BA liability, D1 privacy laws entry)
  - **IP addresses are on the Safe Harbor identifier list** — surprises people who read them as infrastructure, not identity
  - **Linkable data is still PII** — the distractor argues a field is safe because it doesn't identify anyone on its own
  - **Anonymization vs. pseudonymization**: irreversible vs. reversible. An option offering pseudonymization where the requirement is that data can **never** be re-identified is wrong
  - Safe Harbor keeps **year** but strips finer dates, and strips geography **below state level** — "we removed names so it's de-identified" is insufficient
- Related terms: data and asset classification (2.1, the Sensitive/Private tiers), privacy laws — HIPAA/HITECH/GDPR (D1 1.4), data security controls (2.6, DLP keyed to these types), GDPR special categories of personal data (D1, article number [unverified]), data ownership and roles (next entry)
- Sources: [OSG glossary], [NIST SP 800-122], [45 CFR 160.103], [45 CFR 164.514], [unverified]

## Data ownership and roles (2.3, 2.4)
- Definition (ISC2 framing): **ownership** = the formal assignment of responsibility (making someone an owner) to an individual or group [OSG glossary]. Core principle: **execution can be delegated, accountability cannot** — the owner remains liable no matter how much work moves to IT
- Key facts:
  - **Security-management role set** [OSG glossary]:

  | Role | Responsibility | Typically |
  | --- | --- | --- |
  | **Owner / data owner** | **Final corporate responsibility** for classifying and labeling objects, and for protecting and storing data; **may be liable for negligence** if they fail to perform **due diligence** in establishing and enforcing security policy | **CEO, president, or department head** |
  | **Asset owner** (aka **system owner**) | Responsible for classifying information for placement and protection within the security solution; ultimately responsible for asset protection; **delegates** actual data-management tasks to a custodian | High-level manager |
  | **System owner** | The entity responsible for **setting the requirements** for a system; may be the organization as a whole or an individual network/IT manager | Manager or the org |
  | **Custodian** / **data custodian** (aka **data steward**) | **Delegated day-to-day** responsibility: implements the prescribed protection defined by the **security policy and upper management**; performs all activities needed to provide adequate protection | **IT staff or system security administrator** |
  | **User** | Accesses data to perform job duties, within the rules set above | Any employee |

    - Owner/custodian wording overlaps in the glossary (both mention "classifying and labeling") — resolution is **decides vs. implements**: the owner carries final corporate responsibility, the custodian carries the delegated execution
  - **Privacy-law role set** — different framework, different vocabulary:

  | Role | Meaning |
  | --- | --- |
  | **Data controller** | The organization responsible for the collection and use of data; per GDPR, **determines the purposes for which and the means by which** personal data is processed — the **"why" and the "how"** [OSG glossary] |
  | **Data processor** | Per EU data protection law, a natural or legal person, public authority, agency, or other body that **processes personal data solely on behalf of the data controller** [OSG glossary] |
  | **Data subject** | The individual the personal data is about [ISC2 outline] |

    - A SaaS vendor handling your customer records is the **processor**; the customer organization is the **controller** — purchasing a tool does not move determination of purpose
    - GDPR **article numbers not verified**: eur-lex full-text fetch failed again 2026-09-04 (also failed in the 2026-09-01 D1 audit). Definitions above are corroborated across secondary sources; verify article citations against Regulation (EU) 2016/679 text before relying on numbers [unverified]
  - Mechanism:
    1. Ownership is **formally assigned** to a named person/group — not "the business"
    2. The **owner decides** classification; the **custodian applies** the labels and controls
    3. The **owner approves access**; the custodian provisions it; the user consumes it within the rules
    4. Delegation moves the task down and **leaves liability where it was**
  - **How it works vs. how ISC2 frames it**: in practice "data owner" is often a product/business manager who signs a quarterly access review while the security team does the real work. **The exam wants the formal model** — owner = senior **business** role carrying liability; custodian = IT execution; the security team is **neither** by default [unverified]
- Exam traps / distractors:
  - **Owner vs. custodian** — who *decides* classification (owner) vs. who *implements* protection day to day (custodian); the recurring pair
  - **"The owner delegated responsibility to IT"** = wrong; delegation transfers the **task**, never the **accountability**
  - Owner is a **senior business role** (CEO/president/department head) — options naming the **CISO, IT, or the security team** as data owner are distractors
  - **Controller vs. processor**: determines purposes/means vs. acts **on behalf of**; cloud provider = processor, customer = controller
  - **Controller != owner** — different frameworks; a stem written in privacy-law language wants controller/processor vocabulary, not owner/custodian
  - **The processor is not liability-free** — it carries direct obligations of its own; structurally the same point as **HITECH** making business associates directly liable (D1)
  - **Data subject is the person the data is about**, not an internal org-chart role
- Related terms: data and asset classification (2.1, owner assigns classification), sensitive data types (2.1, PII/PHI the controller processes), privacy laws GDPR/HIPAA (D1 1.4), due care and due diligence (D1 1.3, owner negligence), vendor/contractor agreements (D1 1.8, processor contracts), cloud shared responsibility model (CSRM, D3/D8)
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Information and asset handling requirements (2.2)
- Definition (ISC2 framing): the procedures applied to data **because of its classification** across its life — marking, labeling, storing, transporting, transmitting, and destroying [ISC2 outline]
- Key facts:
  - **Security label** = an assigned classification or sensitivity level used in security models to determine the protection required for an object and prevent unauthorized access [OSG glossary]
  - **Marking vs. labeling** — often used interchangeably; where distinguished: **marking** = human-readable (document headers/footers, media stickers, cover sheets), **labeling** = the system/metadata attribute tooling enforces (MAC labels, file metadata, DLP tags) [unverified]
  - Handling requirements travel with the data across states — storage (encryption at rest, physical safe), transport (sealed containers, encrypted media, courier vs. mail), transmission (TLS/IPsec), and end of life (see destruction entry)
  - Media in transit is a distinct handling case: encrypt before it moves, document custody, and prefer a tracked courier for high classifications [unverified]
- Exam traps / distractors:
  - **Handling follows the classification, not the medium** — Secret data on a USB stick gets Secret handling, not "USB policy" handling
  - A **copy inherits the original's classification** — printing, exporting, or screenshotting does not downgrade anything
  - Unlabeled data on a mixed system is treated at the **highest classification the system handles** (system high) [unverified]
  - Labels are set by classification, and classification is set by the **data owner** — the custodian applies the label, doesn't choose it
- Related terms: data and asset classification (2.1), data destruction (2.4), data states (2.6), asset inventory (2.3), MAC labels (D3/D5)
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Asset inventory and management (2.3)
- Definition (ISC2 framing): **asset management** = the process of keeping track of the hardware and software implemented by an organization [OSG glossary]. You cannot classify, protect, or retire what you do not know you have — inventory precedes every other control
- Key facts:
  - **Tangible assets** = physical assets owned by the company; **intangible assets** = intellectual property and other non-physical assets [OSG glossary]. Intangibles that count: IP, software licenses, the data itself, cloud instances, domain names
  - **Configuration management (CM)** = logging, auditing, and monitoring activities related to security controls over time (identifying agents of change), plus the administration of setting up and changing configurations [OSG glossary] — the discipline that keeps the inventory *true* after day one
  - Concrete anchor — **CIS Critical Security Controls v8** [CIS Controls v8]:
    - **Control 1, Inventory and Control of Enterprise Assets** — end-user devices, network devices, non-computing/IoT devices, and servers, whether physical, virtual, remote, or cloud; records include network address, hardware address, machine name, **asset owner**, department, and whether the asset is approved to connect
    - **Control 2, Inventory and Control of Software Assets** — only authorized software installed and able to execute; unauthorized software found and prevented
  - **Shadow IT** = IT components deployed by a department **without the knowledge or permission** of senior management or IT [OSG glossary] — precisely what inventory (and CASB discovery, 2.6) exists to surface
- Exam traps / distractors:
  - **Inventory is the prerequisite**, not a paperwork exercise — a scenario where controls "missed" an asset is an inventory failure first
  - **Intangible assets count** — options limiting asset management to hardware are wrong
  - **Shadow IT is an inventory/governance failure**, not merely a user-behavior problem
  - Asset records carry an **owner** — ties the inventory to the accountability model (2.3 ownership entry)
- Related terms: data ownership and roles (2.3), CASB shadow-IT discovery (2.6), configuration management (D7), EOL/EOS (2.5), asset classification (2.1)
- Sources: [OSG glossary], [CIS Controls v8], [ISC2 outline]

## Data retention and asset end-of-life (2.4, 2.5)
- Definition (ISC2 framing): **retention policy** = a document defining **what data is maintained and for what period of time** [OSG glossary]; **record retention** = the organizational policy defining what information is kept and for how long — most often **audit trails** of user activity (file/resource access, logon patterns, email, use of privileges) [OSG glossary]
- Key facts:
  - Retention is driven by **regulation, contract, and business need** — and **both directions carry risk**: keeping data too long increases exposure and breaches GDPR's **storage limitation** principle (Art. 5(1)(e), D1 GDPR entry); destroying too early is a compliance failure and, in litigation, spoliation [unverified]
  - **Legal hold** = an early step in evidence collection / e-discovery: a **legal notice to a data custodian** that specific data must be **preserved**, with good-faith efforts to preserve the indicated evidence [OSG glossary]
    - A legal hold **suspends the retention schedule** — scheduled destruction stops for the data in scope
    - Conflict case worth knowing: a legal hold generally **overrides a GDPR erasure request**, since the data is needed for a legal obligation/claim [unverified — verify against GDPR Art. 17 exemptions]
  - **End-of-life (EOL) vs. end-of-support (EOS)** [unverified — not in the OSG glossary; verify in the asset security chapter]:
    - **EOL** — vendor stops selling/producing the product
    - **EOS** — vendor stops issuing patches and support; **this is the security-relevant date**
    - Past EOS, unpatched vulnerabilities accumulate permanently -> **compensating controls** (segmentation, allow-listing, enhanced monitoring), the same pattern as the unpatchable-ICS scenario in D1 control types
  - Retention applies to **assets as well as data** (2.5): keep hardware/software only as long as it is supportable and needed
- Exam traps / distractors:
  - **Legal hold beats the retention schedule** — "our policy says delete at 90 days" is not a defense once a hold is in place
  - **"Retain everything forever"** is wrong — storage limitation, cost, and exposure all argue against it
  - **EOL != EOS** — the patch cutoff (EOS) is what creates the risk, not the sales cutoff
  - An **unsupported system still in production** is answered with compensating controls plus a replacement plan, never "accept and ignore"
  - Retention questions ask **how long**; destruction questions ask **how** — read which one the stem wants
- Related terms: data remanence and destruction (2.4, what happens when retention expires), GDPR storage limitation and erasure (D1 1.4), evidence and chain of custody (D1 1.5), compensating controls (D1 1.9), asset inventory (2.3)
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Data collection, location, and maintenance (2.4)
- Definition (ISC2 framing): the middle of the data lifecycle — what you gather, where it physically lives, and keeping it accurate while you hold it [ISC2 outline]
- Key facts:
  - **Collection**: minimize at the point of collection — gather only what the stated purpose requires (GDPR **data minimisation**, Art. 5(1)(c)). Data never collected cannot be breached, mis-handled, or subject to a subject access request
  - **Location** — three terms routinely conflated:

  | Term | Meaning |
  | --- | --- |
  | **Data sovereignty** | Once data is in binary form and stored as digital files, it is **subject to the laws of the country where the storage device resides** [OSG glossary] |
  | **Data localization** | Storing and processing data **within a specific country/region's borders**, driven by regulatory or government mandate [OSG glossary] |
  | **Data residency** | Where data is stored as a business or contractual **choice**, rather than a legal mandate [unverified] |

    - Discriminator: sovereignty = **whose law applies**; residency = **where it sits**; localization = **legally required to stay** in-country
    - Choosing a cloud region does not fully escape sovereignty — the provider's home-country law may still reach the data (cross-ref **CLOUD Act**, D1 legal entry)
  - **Maintenance**: keeping held data accurate and current (GDPR **accuracy**, Art. 5(1)(d)) — correcting stale records, de-duplicating, and re-checking classification as data changes value or content
- Exam traps / distractors:
  - **Sovereignty vs. residency vs. localization** — the three-way discriminator above is the whole question
  - "We host in an EU region, so US law can't reach it" — ignores provider-jurisdiction reach (**CLOUD Act**)
  - **Collection minimization is a security control**, not only a privacy nicety — it shrinks the attack surface and the breach blast radius
  - Classification is not set once — **maintenance includes re-evaluating** it as data ages (ties to declassification, 2.4)
- Related terms: transborder data flow (D1 1.4), GDPR principles and transfers (D1 1.4), CLOUD Act (D1 1.4), data retention (2.4), data classification (2.1)
- Sources: [OSG glossary], [ISC2 outline], [unverified]
