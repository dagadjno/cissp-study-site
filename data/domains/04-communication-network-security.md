# Domain 4: Communication and Network Security

<!-- REVIEW -->
## OSI/TCP-IP models, IP addressing, secure protocols (4.1)
- Definition (ISC2 framing): outline 4.1 lists "OSI and TCP/IP models", "IPv4 and IPv6 (unicast, broadcast, multicast, anycast)", "secure protocols (IPSec, SSH, SSL/TLS)" [ISC2 outline]. **OSI** (Open Systems Interconnection) = **ISO** seven-layer reference model [OSG glossary]; **TCP/IP model** = 4 layers — Application (Process), Transport (Host-to-Host), Internet, Link (Network Interface / Network Access) — aka **DARPA** model [OSG glossary]. Exam tests the layer-to-name/device/container mapping and which protocol is *current*, not mechanics.
- Key facts:
  - Layer map (PDU = protocol data unit; container names [OSG glossary], device/protocol placement per OSG framing [unverified] — verify OSG ch. 11):

  | OSI layer | Container | Devices / protocols | TCP/IP layer |
  | --- | --- | --- | --- |
  | 7 Application | **PDU** | gateway, proxy, app firewall; HTTP, SMTP, DNS | Application |
  | 6 Presentation | PDU | encoding, compression, format encryption | Application |
  | 5 Session | PDU | dialogue control (simplex/half/full duplex); RPC, NFS | Application |
  | 4 Transport | **segment** (TCP) / **datagram** (UDP) | circuit-level gateway, stateful firewall; TCP, UDP | Transport |
  | 3 Network | **packet** | router, L3 switch; IP, ICMP, IPsec | Internet |
  | 2 Data Link | **frame** (header + payload + footer) | switch, bridge; MAC, ARP, 802.1Q, 802.1X | Link |
  | 1 Physical | bits | hub, repeater, cabling, NIC | Link |

  - **Encapsulation**: each layer's content becomes the payload of the next-lower layer, header added; inverse = de-encapsulation; also describes tunneling (protocol inside protocol) [OSG glossary]
  - Address types:

  | Type | Recipients | Exam note |
  | --- | --- | --- |
  | **Unicast** | one identified recipient [OSG glossary] | |
  | **Broadcast** | multiple *unidentified* recipients [OSG glossary] | IPv4 only — "no broadcast addresses in IPv6" [RFC 4291] |
  | **Multicast** | multiple *identified* recipients [OSG glossary] | supersedes broadcast in IPv6 [RFC 4291] |
  | **Anycast** | *nearest/best* one of a group per routing metric [OSG glossary] [RFC 4291] | same address on many nodes — CDNs, DNS root servers |

  - **IPv4** 32-bit; **IPv6** 128-bit, scoped addresses, autoconfiguration, QoS priority values [OSG glossary]; IPv6 header drops the checksum, fragmentation only by source nodes, extension headers, Hop Limit replaces TTL [RFC 8200]; private IPv4 blocks 10/8, 172.16/12, 192.168/16 [RFC 1918]; IPv6 temporary (privacy) addresses [RFC 4941, obsoleted by RFC 8981]; **NAT66** exists [OSG glossary]; **dual stack** = both protocols on one host [OSG glossary]
  - **IPsec** (Internet Protocol Security) — architecture [RFC 4301]; NIST SP 800-77 Rev 1 "Guide to IPsec VPNs" (June 2020) [NIST SP 800-77]:

  | | AH (Authentication Header) | ESP (Encapsulating Security Payload) |
  | --- | --- | --- |
  | IP protocol # | **51** [OSG glossary] | **50** [OSG glossary] |
  | Services | connectionless integrity, data-origin authentication, anti-replay; **no confidentiality** [RFC 4302] | **confidentiality**, plus optional integrity/authentication, anti-replay, limited traffic-flow confidentiality [RFC 4303] |
  | Implementation | **MAY** support [RFC 4301] | **MUST** support [RFC 4301] |
  | Trap | integrity covers IP header -> breaks through NAT [RFC 3715 §2.1] | integrity does not cover the outer IP header [RFC 4303] |

  - Modes: **transport** = payload only encrypted, IP header plaintext, host-to-host / end-to-end [OSG glossary]; **tunnel** = whole original packet protected, new outer header added, gateway-to-gateway / "link encryption VPN" [OSG glossary] [RFC 4301]
  - **SA** (security association) = simplex "connection"; **SPD** (security policy database) decides disposition; **SAD** (SA database) holds SA parameters [RFC 4301]; **IKE** (Internet Key Exchange) = Oakley + SKEME + **ISAKMP** (Internet Security Association and Key Management Protocol) [OSG glossary]; **IKEv2** does mutual authentication and establishes the IKE SA [RFC 7296]
  - **SSH** (Secure Shell): encrypted replacement for Telnet, FTP, rlogin; SSH1 vs SSH2 — SSH2 drops DES/IDEA [OSG glossary]; architecture RFC 4251, transport RFC 4253, TCP **22** [RFC 4253]
  - **SSL** (Secure Sockets Layer) = **legacy**, replaced by TLS; ISC2 places it "at the Transport layer to encrypt TCP payloads" [OSG glossary]; SSLv3 deprecated [RFC 7568, cited in RFC 8996]; **TLS 1.0/1.1 deprecated** (March 2021) [RFC 8996]; **TLS 1.3** [RFC 8446, Aug 2018]: static RSA/DH removed -> every key exchange gives **forward secrecy**, AEAD-only ciphers, handshake encrypted after ServerHello, 1-RTT, optional **0-RTT** (weaker, replayable); NIST SP 800-52 Rev 2 (Aug 2019): TLS 1.2 required, TLS 1.3 support by 1 Jan 2024 [NIST SP 800-52]; TLS v1.2 (2011) dropped SSLv3 downgrade [OSG glossary]
- Exam traps / distractors:
  - **"Network interface" layer != network addressing**: TCP/IP Link layer (aka Network Interface / Network Access) = OSI L1-2 (MAC, frames, NIC) [OSG glossary]; subnet masks / IP addressing / routing = OSI **Network** = TCP/IP **Internet** layer. The shared word "network" is the whole trap (missed 2026-10-04: picked Network interface for subnet-mask work). Example: carving 10.0.0.0/24 into /26 host ranges = OSI Network / TCP-IP Internet; NOT Network interface, which handles the MAC header and 802.1Q tag on the same host
  - Pattern: two options share a word with the stem -> translate each layer name to its *function* first, then match; model vocabulary (OSI vs. TCP/IP) is interchangeable once mapped
  - Any option naming **SSL** as the control to deploy today is wrong; answer is TLS 1.2+ (1.3 preferred)
  - **AH** "encrypts" -> false; **ESP** "authenticates" -> true but optional; "integrity of the whole packet incl. header" -> AH
  - "Protect traffic between two office gateways" -> **tunnel** mode; "host-to-host, headers visible for routing/QoS" -> **transport**
  - **Broadcast** in IPv6 -> does not exist; **anycast** (nearest one) vs **multicast** (all in group)
  - Container names: TCP **segment**, UDP **datagram**, Layer 2 **frame**, Layers 5–7 **PDU**
  - "IPv6 is secure because IPsec is built in" -> IPsec is *available*, not automatic; IPv6 adds attack surface (rogue router advertisements [RFC 6104 §1–2; RFC 3756 §4.2.1], NDP spoofing [RFC 3756 §4.1.1], 6to4/Teredo tunnels bypassing IPv4 controls [RFC 6169 §2.1–2.2]); mitigations RA Guard [RFC 6105], SEND [RFC 3971]
  - OSI comes from **ISO**; TCP/IP model from **DARPA/DoD**; a "Layer 4 firewall" (circuit-level) sees ports, not application content
- Related terms: multilayer/converged protocols (next entry), VPN protocols and split tunnel (4.3), PKI (3.6), cryptographic attacks incl. downgrade (3.7)
- Sources: [ISC2 outline], [OSG glossary], [RFC 4291], [RFC 8200], [RFC 1918], [RFC 4941], [RFC 4301], [RFC 4302], [RFC 4303], [RFC 7296], [RFC 4253], [RFC 8996], [RFC 8446], [RFC 3715], [RFC 6104], [RFC 3756], [RFC 6169], [NIST SP 800-77], [NIST SP 800-52], [unverified]

## Multilayer and converged protocols, transport architecture, performance metrics (4.1)
- Definition (ISC2 framing): **multilayer protocols** = a suite operating across multiple OSI layers via encapsulation, e.g., TCP/IP [OSG glossary]; **converged protocols** = specialty/proprietary protocols merged with standard TCP/IP-suite protocols — FCoE, MPLS, iSCSI, VoIP [OSG glossary]; outline adds InfiniBand over Ethernet and Compute Express Link [ISC2 outline]. Transport architecture = topology, data/control/management planes, store-and-forward; metrics = bandwidth, latency, jitter, throughput, signal-to-noise ratio [ISC2 outline].
- Key facts:
  - Implications of multilayer protocols (OSG framing) [unverified] — benefits: many protocols usable at higher layers, encryption can be added at several layers, flexibility/resiliency; drawbacks: **covert channels**, **filter bypass** (encapsulated content hides from filters), logically imposed segment boundaries can be crossed. Classic example: ICS protocols (Modbus, DNP3) wrapped in TCP/IP inherit every IP-layer attack [unverified]
  - Converged protocols:

  | Protocol | What | Security note |
  | --- | --- | --- |
  | **iSCSI** | SCSI over TCP/IP; low-cost SAN alternative to Fibre Channel [OSG glossary] | CHAP auth; spec mandates IPsec implementation [RFC 7143]; isolate storage network |
  | **FCoE** | Fibre Channel frames in Ethernet; needs 10 Gbps [OSG glossary] | Layer 2 only, **not routable**; no native crypto [unverified — SP 800-209 confirms FC-in-Ethernet encapsulation and recommends FIP snooping (NC-SS-R23) but is silent on routability/crypto; check INCITS FC-BB-5] |
  | **FCIP** | Fibre Channel over IP (routable) [OSG glossary] | trap vs FCoE |
  | **IBoE** (InfiniBand over Ethernet) | InfiniBand in Ethernet frames; HPC low latency [OSG glossary]; industry = **RoCE** (RDMA over Converged Ethernet) [IBTA] | RDMA bypasses host stack (non-privileged app talks to RDMA engine without kernel mediation) [RFC 5042 §2.1] -> invisible to host controls [unverified — inference] |
  | **CXL** (Compute Express Link) | cache-coherent CPU–memory/accelerator interconnect [CXL Consortium]; ISC2 files it as converged [OSG glossary] | pooled/shared memory -> tenant isolation risk [unverified] |
  | **MPLS** | forwards on short labels, not addresses [OSG glossary] | separation, **not encryption** |
  | **VoIP** | voice over IP; SIP signaling + RTP media | threats in 4.3 entry |

  - Topologies [OSG glossary]:

  | Topology | Structure | Failure / security |
  | --- | --- | --- |
  | **Bus** | trunk/backbone cable, collisions | one break kills segment; everyone sees all traffic |
  | **Ring** | points on a circle | one break stops ring unless dual ring |
  | **Star** | central hub/switch, dedicated segments | central device = single point of failure |
  | **Mesh** | many point-to-point links; full vs partial | most redundant, most costly |

  - Planes [RFC 7426]:

  | Plane | Function | SOC mapping / attack |
  | --- | --- | --- |
  | **Data** (forwarding) | forwards traffic | ASIC path, ACL hits; volumetric DoS |
  | **Control** | decides how devices process/forward; time-critical | routing protocols, STP, SDN southbound; route injection, BPDU spoofing |
  | **Management** | monitor, configure, maintain; longer timescale | SSH/SNMP/NETCONF to devices; needs out-of-band + MFA |
  | **Application** (SDN) | programs network behavior | northbound API |

  - Switching methods [unverified — no primary source; verify vendor docs]: **store-and-forward** = buffer whole frame, verify CRC, then forward — higher latency, drops corrupt frames; **cut-through** = forward after reading destination MAC — lowest latency, propagates errors. **Circuit switching** = dedicated physical path [OSG glossary], constant traffic, fixed delays, connection-oriented; **packet switching** = messages broken into packets at sending router [OSG glossary], bursty, variable delay, connectionless [unverified]
  - Metrics:

  | Metric | Meaning | Security / ops tie |
  | --- | --- | --- |
  | **Bandwidth** | link capacity (max bit rate) [RFC 5136 §2.2] | bandwidth monitor exposes malware comms, misuse [OSG glossary] |
  | **Throughput** | bits actually delivered [OSG glossary] | always <= bandwidth; inspection/encryption cost |
  | **Latency** | delay, one-way or round-trip, ms [OSG glossary] | GEO satellite worst; VoIP-sensitive |
  | **Jitter** | variable latency [OSG glossary]; packets arrive out of sequence [NIST SP 800-58] | jitter buffers, QoS |
  | **SNR** (signal-to-noise ratio) | signal vs noise power | **jamming** works by lowering effective SNR [OSG glossary] |
  | **Packet loss** | dropped packets | QoS item [OSG glossary] |

  - **QoS** (quality of service) measures throughput rate, bit rate, packet loss, latency, jitter, transmission delay, availability [OSG glossary]
- Exam traps / distractors:
  - Multilayer "encryption at multiple layers" = **benefit**; "covert channels / filter bypass" = **drawback** — questions flip these. Example: TLS inside an IPsec tunnel = the benefit; DNS-tunneled exfil riding permitted UDP 53 = the drawback (same encapsulation property)
  - **iSCSI** (routable, IP) vs **FCoE** (L2, not routable) vs **FCIP** (FC over IP). Example: replicate the SAN to a DR site over the WAN -> FCIP; FCoE never leaves the one L2 fabric; iSCSI on a flat server VLAN is reachable by any compromised host
  - **MPLS** or carrier "private circuit" offered as confidentiality control -> wrong; encrypt on top. Example: MPLS to a branch = carrier keeps label paths apart like VLANs, but any tap on the carrier path reads plaintext; run IPsec over it
  - **Bandwidth** (capacity) vs **throughput** (achieved); **latency** (delay) vs **jitter** (variation) — VoIP quality complaint with stable delay -> jitter
  - "Engineer configures router over SSH" -> **management plane**; "routers exchange OSPF updates" -> **control plane**; "packets forwarded" -> data plane
  - **Store-and-forward** is chosen for error checking, not speed; cut-through for latency
  - Converged protocol = specialty protocol *on* standard TCP/IP, not "protocol spanning layers" (that is multilayer). Example: HTTP inside TCP inside IP inside Ethernet = multilayer (the TCP/IP suite itself); SCSI disk commands riding that same TCP/IP (iSCSI) = converged
- Related terms: OSI encapsulation (previous entry), SDN planes/APIs (SDN entry), VoIP/SIP (4.3), ICS (3.5), HPC (3.5)
- Sources: [ISC2 outline], [OSG glossary], [RFC 7143], [RFC 7426], [RFC 5042], [RFC 5136], [NIST SP 800-58], [IBTA], [CXL Consortium], [unverified]

## Segmentation and traffic flows: physical, logical, micro, edge (4.1)
- Definition (ISC2 framing): outline groups traffic flows (north-south, east-west), physical segmentation (in-band, out-of-band, air-gapped), logical segmentation (VLANs, VPNs, VRF, virtual domain), micro-segmentation (network overlays/encapsulation, distributed firewalls/routers, zero trust), edge networks (ingress/egress, peering) [ISC2 outline]. Managerial view: segmentation limits blast radius and lateral movement; pick the *cheapest control that matches the trust boundary*.
- Key facts:
  - **North-south** = inbound/outbound between internal and external systems; **east-west** = within the network, data center, or cloud [OSG glossary] (Example: north-south = user browser -> web tier through the perimeter firewall; east-west = web tier -> DB tier inside the DC, where flat VLANs let ransomware spread); perimeter firewalls see north-south only; **lateral movement** is east-west -> needs internal segmentation firewalls / microsegmentation / NDR
  - Physical segmentation:

  | Term | Meaning | Exam framing | Example |
  | --- | --- | --- | --- |
  | **Air gap** | physical network segregation [OSG glossary]; no physical connection, any logical transfer manual under human control [CNSSI 4009 via NIST glossary] | strongest isolation; removable media = residual vector | ICS historian patched by hand-carried, scanned USB |
  | **Out-of-band** (OOB) | information carried on a separate communications channel [NISTIR 7711 via NIST glossary] | dedicated management network / console; works when production is down; protects management plane | console server on a separate mgmt network, reachable when prod is down |
  | **In-band** | management traffic rides the production data network [RFC 4778 §2.2] | cheaper; compromised production = compromised management; encrypt + restrict | SSH to the switch over the production VLAN |

  - Logical segmentation:

  | Tech | Layer / scope | Isolation limits | Example |
  | --- | --- | --- | --- |
  | **VLAN** | Layer 2 on switches/bridges; tagging per **IEEE 802.1Q** [OSG glossary] [IEEE 802.1Q] | cross-VLAN needs routing (multilayer switch) [OSG glossary]; **VLAN hopping** by double tagging [OSG glossary]; 4,094 IDs [RFC 7348] | VLAN 10 users / VLAN 20 printers on one switch; NOT isolation — a double-tagged frame hops it |
  | **VPN** | encrypted connection over private/public network; confidentiality + integrity [OSG glossary] | protects a path, does not segment the interior; split vs full tunnel (4.3) | IPsec site-to-site to a branch protects the WAN hop; the branch LAN stays flat |
  | **VRF** (virtual routing and forwarding) | multiple routing tables in one router, independent routing domains; service-provider multi-tenancy [OSG glossary] [RFC 4364] | Layer 3 separation on shared hardware/control plane | one carrier PE router holding separate routing tables for customers A and B |
  | **Virtual domain** | isolated instances of one device (firewall, switch), own config; aka virtual systems/contexts [OSG glossary] | device-level multi-tenancy; shared chassis | one physical firewall running a vsys/VDOM per business unit |

  - **Microsegmentation** = internal network divided into numerous subzones via internal segmentation firewalls (**ISFW**), subnets, or VLANs; zones down to one device; all inter-zone traffic filtered, may require authentication, often encrypted [OSG glossary]. Example: host-level policy allowing only app tier -> DB on 1433, so two DB servers in the same subnet cannot talk to each other; NOT "one VLAN per tier", which still lets any web server reach every other web server. Enablers:
    - **Overlays / encapsulation**: **VXLAN** — Layer 2 over Layer 3 in UDP 4789, 24-bit VNI (~16M segments vs 4,094 VLANs) [RFC 7348]; overlay = encapsulation, **not encryption** [RFC 7348 §7]
    - **Distributed firewalls/routers**: policy enforced at hypervisor / vNIC / host agent instead of a choke point; virtual firewalls and overlay-based segmentation in NIST SP 800-125B (Mar 2016) [NIST SP 800-125B]
    - **Zero trust**: per-session, identity-driven policy (SP 800-207; D3 entry); NIST SP 800-215 "Guide to a Secure Enterprise Network Landscape" (Nov 2022) covers microsegmentation, SDP, ZTNA, SASE, SD-WAN [NIST SP 800-215]
  - Edge: **edge network** allocates compute to edge devices, away from central servers [OSG glossary]; **edge computing** = processing inside devices at/near the edge (IIoT) [OSG glossary]. **Ingress filter** = inbound into secured area; **egress filter** = outbound [OSG glossary]; **egress monitoring** targets exfiltration [OSG glossary]. **Peering** = direct interconnection between autonomous networks to exchange traffic without paying transit [NIST SP 800-189 §2.3: lateral p2p peer = "non-transit"] ("without paying" part [unverified]); risks BGP hijack / route leak -> RPKI, prefix filters [NIST SP 800-189 §2.1, §2.3, §4.3–4.6]
    - Example: edge computing = the factory gateway runs the anomaly model locally and ships only alerts upstream; peering = your AS and the CDN's AS swap each other's routes at an IXP, while transit = paying an upstream ISP to reach everything else
  - Perimeter vocabulary [OSG glossary]: **DMZ** term deprecated -> **screened subnet** (public-facing hardened servers outside the internal trust); **extranet** = screened subnet for B2B partners, usually via VPN; **intranet** = private LAN; **bastion host** = hardened to withstand attack; **screened host** = router filtering in front of a server; **multihomed** = multiple interfaces on different subnets
    - Example: public web servers and the mail relay = screened subnet; the same tier hosting a supplier EDI portal reachable only over partner VPN = extranet; the HR wiki = intranet
- Exam traps / distractors:
  - **Air gap** (no connection at all) vs **out-of-band** (separate channel, still connected) — "management still reachable during an outage" -> OOB, not air gap
  - **VLAN** alone offered as the security boundary -> segmentation, not isolation (hopping, misconfig, no encryption); **VPN** offered as segmentation -> it is a protected path
  - **VRF** (L3 routing tables) vs **VLAN** (L2 broadcast domains) vs **virtual domain** (device instance)
  - "Perimeter firewall inspects..." -> north-south; "server-to-server inside DC" -> east-west, answer is **microsegmentation**
  - **VXLAN/overlay** = encapsulation for scale/mobility, not confidentiality — add IPsec [RFC 7348 §7]/MACsec [unverified]
  - **DMZ** as the "correct" term -> ISC2 now says screened subnet; **extranet** vs **intranet**
  - **Egress** filtering prevents exfiltration and spoofed-source DDoS participation; **ingress** blocks inbound spoofing — read direction carefully
- Related terms: zero trust and PDP/PEP (D3), SASE (3.1), SDN/VPC (SDN entry), NAC (4.2), firewalls (7.7), egress monitoring (7.2)
- Sources: [ISC2 outline], [OSG glossary], [NIST glossary], [IEEE 802.1Q], [RFC 7348], [RFC 4364], [RFC 4778], [NIST SP 800-125B], [NIST SP 800-215], [NIST SP 800-189], [unverified]

## Wireless and cellular networks (4.1)
- Definition (ISC2 framing): outline 4.1 lists wireless networks (Bluetooth, Wi-Fi, Zigbee, satellite) and cellular/mobile (4G, 5G) [ISC2 outline]. Managerial framing: RF cannot be physically contained — treat every wireless link as an untrusted transport, authenticate at Layer 2 and encrypt end-to-end above it.
- Key facts:
  - Wi-Fi security generations:

  | Generation | Cipher | Authentication | Status |
  | --- | --- | --- | --- |
  | **WEP** (Wired Equivalent Privacy) | RC4, weak IVs [OSG glossary] | shared key | cracked in under a minute, worthless [OSG glossary] |
  | **WPA** | RC4 + **TKIP** (or Cisco **LEAP**) [OSG glossary] | PSK personal / 802.1X enterprise | insecure; replaced by WPA2 in 2004 [OSG glossary] |
  | **WPA2** (= IEEE 802.11i) | AES-**CCMP** [OSG glossary] | **PSK** (personal) / **802.1X** (enterprise) [OSG glossary] | PSK exposed to offline dictionary attack on the handshake [unverified — SP 800-97 §4.2.1 only says a weak passphrase-derived PSK compromises the WLAN; check IEEE 802.11-2020 or Wi-Fi Alliance WPA3 spec] |
  | **WPA3** | AES-CCMP; enterprise 192-bit mode [OSG glossary] [Wi-Fi Alliance] | **SAE** (Simultaneous Authentication of Equals; Dragonfly, Diffie-Hellman-derived zero-knowledge) replaces PSK [OSG glossary] | **PMF** (protected management frames, 802.11w-2009) required [OSG glossary] [Wi-Fi Alliance]; SAE gives forward secrecy + offline-dictionary resistance [Wi-Fi Alliance] |

  - **Wi-Fi Enhanced Open** (OWE) = unauthenticated encryption for open networks [Wi-Fi Alliance]; **WPS** PIN brute-forced in under six hours -> disable [OSG glossary]; **captive portal** = redirect to auth/payment page [OSG glossary]; disabling **SSID** broadcast is not security — scanners still see the base station [OSG glossary]; **site survey** -> **heat map** [OSG glossary]
  - Modes [OSG glossary]: **ad hoc** (peer-to-peer, no encryption; updated = Wi-Fi Direct, uses ISSID); **infrastructure** — stand-alone (no wired access), wired extension, enterprise extended (many APs, one network), bridge (link two wired LANs)
  - Wireless attacks [OSG glossary]: **rogue AP** = any unauthorized AP on the network; **evil twin** = attacker AP clones a known SSID to catch auto-reconnecting clients; **deauthentication** / **disassociation** frames = DoS, defeated by PMF; **war driving**; **IV attack** (WEP); **jamming** lowers SNR; **replay**
  - **IEEE 802.1X** = port-based authentication, an "authentication proxy" to RADIUS/TACACS+ [OSG glossary]; roles supplicant / authenticator / authentication server [NIST SP 800-97 §3.4]; **EAP** (Extensible Authentication Protocol) = a *framework* supporting many methods, runs over the link layer (PPP, 802) without IP [RFC 3748]:

  | Method | Mechanism | Verdict |
  | --- | --- | --- |
  | **EAP-TLS** | certificate-based **mutual** authentication [RFC 5216] | strongest; PKI cost |
  | **EAP-TTLS** | TLS tunnel first, then inner auth; extension of EAP-TLS [OSG glossary] | server cert only |
  | **PEAP** | EAP methods inside a TLS tunnel [OSG glossary] | common with MSCHAPv2 inner (Windows PEAP supports MS-CHAPv2 only) [NIST SP 800-97 §6.1.3.3] |
  | **EAP-FAST** | Cisco; proposed replacement for LEAP [OSG glossary] | acceptable |
  | **LEAP** | Cisco proprietary; legacy, avoid [OSG glossary] | trap: "Lightweight" != secure |
  | **EAP-MD5** | MD5 password hash; deprecated [OSG glossary] | no mutual auth |
  | **EAP-SIM** | GSM SIM-based device auth [OSG glossary] | cellular offload |

  - **Bluetooth** (IEEE 802.15), 2.4 GHz pairing; **BLE** low-power, not compatible with classic but coexists [OSG glossary]; NIST SP 800-121 Rev 2 Upd 1 (Jan 2022) Bluetooth security guide [NIST SP 800-121]. Attacks [OSG glossary]:

  | Attack | Effect |
  | --- | --- |
  | **Bluejacking** | unsolicited messages sent to device |
  | **Bluesnarfing** | connect without knowledge, **extract data** (contacts, conversations) |
  | **Bluebugging** | **remote control** of device functions (e.g., mic as bug) |
  | **Bluesmacking** | DoS |
  | **Bluesniffing** | eavesdropping / packet capture |

  - **Zigbee**: ISC2 glossary frames it as IoT comms "based on Bluetooth", low power, low throughput, close proximity [OSG glossary]; technically built on **IEEE 802.15.4** low-rate WPAN [IEEE 802.15.4], self-healing mesh, AES-128 [CSA]; weakness = well-known default trust-center *link* key ("ZigBeeAlliance09") used to protect network-key transport at join when no install-code or pre-programmed key exists [CSA Zigbee Direct spec 20-27688-037 §7.7.2.7.1] — Correction (audit 2026-09-28): previously read "well-known/default network keys"; the spec's well-known default is a link key, not a network key
  - **Satellite** (SATCOM) [OSG glossary]:

  | Orbit | Altitude | Trade-off |
  | --- | --- | --- |
  | **LEO** | 160–2,000 km | strong signal, low latency, many satellites needed (Starlink) |
  | **MEO** | 2,000–35,786 km | larger footprint than LEO, longer visibility |
  | **GEO** | 35,786 km | fixed position, fixed antennas, largest footprint, **highest latency** |

  - Satellite risks: huge footprint -> interception, jamming, spoofing [NISTIR 8270 (Jul 2023) Table 1]; provider ground segment is a third party (ground operations "can be outsourced") [NISTIR 8270 §2.1.3] -> encrypt end-to-end [unverified]
  - Other RF [OSG glossary]: **NFC** (inches, RFID-derived), **RFID** (readable at distance), **LiFi** (light, line of sight, immune to RF jamming), **WiMAX** 802.16
  - Cellular: cells around base stations [OSG glossary]; **4G** in use since early 2000s, **5G** latest as of 2020 [OSG glossary]; NIST SP 800-187 "Guide to LTE Security" (Dec 2017) [NIST SP 800-187]; NIST SP 1800-33 "5G Cybersecurity" (draft, 2025) [NIST SP 1800-33]; 5G = service-based architecture, **network slicing**, AUSF/SEAF security functions [3GPP]; 5G *can* conceal the permanent subscriber ID (SUPI -> SUCI, ECC-encrypted with the home operator's public key) to defeat IMSI catchers — Rel-15+ devices/network functions must support it, but enabling it is **optional** for operators and a null protection scheme leaves the SUPI in clear [NIST CSWP 36A (Mar 2026); defined in 3GPP TS 33.501 — spec text not retrieved, verify there] — Correction (audit 2026-09-28): previously read "5G conceals the permanent subscriber ID", implying concealment is automatic; 4G/LTE exposed to rogue base stations (IMSI/IMEI tracking) and downgrade to 2G/3G [NIST SP 800-187 §4.2, §4.2.1, §4.2.2]; ISC2 framing: carrier network is not your trust boundary — VPN/TLS over it
- Exam traps / distractors:
  - **WPA2-Personal** (shared PSK, one leak = everyone) vs **WPA2/3-Enterprise** (802.1X, per-user credentials); **SAE** is not 802.1X — it replaces the PSK handshake
  - **Evil twin** (impersonates a known SSID) vs **rogue AP** (unauthorized device on your wire)
  - **EAP** is a framework, not an authentication method; **LEAP** and **EAP-MD5** are the legacy distractors; **EAP-TLS** is the only mutual-cert option
  - **Bluesnarfing** (steal data) vs **bluejacking** (send spam) vs **bluebugging** (take control)
  - **GEO** = latency, **LEO** = coverage handoffs; satellite "private link" still needs encryption
  - **Zigbee** is 802.15.4, not Bluetooth (glossary says otherwise — if the exam offers "Bluetooth-based" as the *distinguishing* trait, check the other options first)
  - Hiding SSID / MAC filtering / WPS = obscurity or weakness, never the "best" control; **PMF/802.11w** is what stops deauth DoS
- Related terms: NAC and 802.1X enforcement (4.2), RADIUS/TACACS+ (4.3), IoT and embedded systems (3.5), emanation/TEMPEST (4.2), physical security (7.14)
- Sources: [ISC2 outline], [OSG glossary], [Wi-Fi Alliance], [RFC 3748], [RFC 5216], [IEEE 802.15.4], [CSA], [NIST SP 800-97], [NIST SP 800-121], [NIST SP 800-187], [NIST SP 1800-33], [NISTIR 8270], [NIST CSWP 36A], [3GPP], [unverified]

## SDN, SD-WAN, NFV, VPC, CDN, and network monitoring/management (4.1)
- Definition (ISC2 framing): outline 4.1 lists CDN; software-defined networks (SDN, APIs, SD-WAN, network functions virtualization); VPC; monitoring and management (network observability, traffic shaping, capacity management, fault handling) [ISC2 outline]. Common thread: the network becomes software -> the **controller/API/CSP console** is the new crown jewel.
- Key facts:
  - **SDN** (software-defined networking): separates the infrastructure layer (hardware) from the control layer; centrally programmable, vendor-neutral, open standards [OSG glossary]. Planes per [RFC 7426]: data/forwarding, control, management, application; **southbound** interface = controller -> devices, **northbound** = controller -> applications (via NSAL) [RFC 7426]. OSG glossary instead labels controller->devices **eastbound** and controller->applications **westbound** [OSG glossary] — know both labels
    - Example: southbound = controller pushes flow rules to the switch over OpenFlow; northbound = the ticketing/automation app calls the controller's REST API to request a new segment
  - SDN security: controller = high-value single point of failure; northbound **APIs** inherit API attacks (injection, auth bypass, replay) [OSG glossary]; harden with OOB management, MFA, TLS on both interfaces, controller redundancy [unverified]; OpenFlow = southbound protocol example (control-plane southbound interface, CPSI, alongside ForCES) [RFC 7426 §3.3, §4.3]
  - **SD-WAN**: SDN evolution managing connectivity between distant data centers, remote sites, and cloud over WAN links [OSG glossary]; typically an encrypted overlay across broadband/MPLS/LTE with central policy; listed alongside SASE, ZTNA, SDP in NIST SP 800-215 [NIST SP 800-215]
  - **NFV** (network functions virtualization): virtualizes network functions off dedicated hardware; SDN + NFV = flexible, scalable, programmable infrastructure; aka virtualized networking [OSG glossary]; VNFs (virtual firewall, router, load balancer) share hypervisor risk — virtual network configuration guidance in NIST SP 800-125B [NIST SP 800-125B]
  - Software-defined family [OSG glossary]: **SDV** (software-defined visibility) automates monitoring/response, analyzes every packet; **software-defined security** = controls managed as code in CI/CD; **SDS** storage; **SDDC** = virtual data center (IaaS-like); **SDx** umbrella
  - **VPC** (virtual private cloud): isolated section of a CSP's cloud where the customer provisions and controls the virtual network [OSG glossary]; **VPC endpoint** = VM/VDI instance as access point to cloud assets [OSG glossary]; building blocks: public/private subnets, **security groups** (stateful, per instance) vs **network ACLs** (stateless, per subnet), private endpoints to CSP services (PrivateLink) [AWS docs — Amazon VPC User Guide, "Infrastructure security in Amazon VPC"]; VPC peering / transit gateway [unverified — AWS terminology, not on that page]
    - Example: VPC = your own 10.20.0.0/16 with public/private subnets inside the CSP, isolated from other tenants but not encrypted; VPN = the IPsec tunnel from HQ into that VPC
    - Example: security group = per-instance "allow 443 from the load balancer", return traffic allowed automatically; NACL = subnet-wide "deny 22 from 0.0.0.0/0" that needs its own return-traffic rule because it is stateless
  - **CDN** (content distribution/delivery network): resource services in many data centers for low latency, high performance, high availability via distributed hosts [OSG glossary]; relies on **anycast**; security: absorbs DDoS, edge WAF, but **TLS terminates at the CDN** -> third party sees plaintext; cache poisoning; origin exposure if origin IP leaks [unverified]; **SDP** (service delivery platform) is the telecom cousin [OSG glossary]
  - Monitoring and management:

  | Function | Meaning | Note | Example |
  | --- | --- | --- | --- |
  | **Network observability** | infer internal state from telemetry (flows, metrics, logs, traces), not just up/down polling [unverified] | NetFlow/IPFIX, streaming telemetry | flows + traces explain *why* the app is slow; up/down polling only says *that* it is |
  | **Traffic shaping** | delay/prioritize packets to fit policy [RFC 2475 §1.2, §2.3.3.3] | QoS metrics: throughput, bit rate, loss, latency, jitter, delay, availability [OSG glossary] | queue the nightly backup burst to smooth the link; policing drops packets over the contracted rate |
  | **Capacity management** | ensure resources meet current and forecast demand | **bandwidth on demand** at premium rates [OSG glossary]; cloud **resource capacity agreement** [OSG glossary] | upgrade the WAN before quarter-end close saturates it |
  | **Fault handling** | **fault-tolerant network** recovers from minor errors; **fault-resistant network** survives faults to minimize downtime [OSG glossary] | redundancy + failover; availability pillar | dual uplinks: one fails, traffic reroutes with no outage |
  | **Bandwidth monitor** | tracks usage; reveals malware comms, protocol misuse [OSG glossary] | SOC egress baseline | steady 02:00 outbound spike from one host = beaconing or exfil |

- Exam traps / distractors:
  - **SDN** (separate control from forwarding) vs **NFV** (virtualize the function) vs **SD-WAN** (SDN applied to WAN links) — options swap them. Example: SDN = one controller programs every DC switch's forwarding; NFV = the firewall becomes a VM on commodity x86; SD-WAN = branch edge boxes steer SaaS over broadband and ERP over MPLS from central policy
  - **Northbound** (apps/API) vs **southbound** (devices); if options say **westbound/eastbound**, it is OSG's labels for the same pair
  - Controller compromise = whole network; answer favoring "secure the controller and its APIs" over "harden each switch"
  - **VPC** (cloud network isolation) vs **VPN** (encrypted path) — VPC is not encryption; **security group** (stateful, instance) vs **NACL** (stateless, subnet) [AWS docs — Amazon VPC User Guide, "Compare security groups and network ACLs"]
  - **CDN** improves availability/latency and blunts DDoS but is a third party in the TLS path — confidentiality question -> not the CDN's job. Example: the CDN absorbs the SYN flood and runs the edge WAF, but it holds your certificate and decrypts every request — customer-data confidentiality is answered at the origin/app, not by "use a CDN"
  - **Traffic shaping** (delay, smooth) vs **policing** (drop) [RFC 2475 §1.2, §2.3.3.3–2.3.3.4]; **observability** vs monitoring (why vs whether)
  - **Fault tolerance** (keeps operating through the fault) vs **high availability** (minimizes downtime) vs fault-resistant (glossary term). Example: fault tolerance = a mirrored disk dies and the server never pauses; high availability = cluster failover with a 30-second blip — both score as availability, only tolerance means zero interruption
- Related terms: planes (converged/transport entry), microsegmentation and VXLAN (segmentation entry), SASE (3.1), cloud shared responsibility (3.5), HA/QoS/fault tolerance (7.10), APIs (8.5)
- Sources: [ISC2 outline], [OSG glossary], [RFC 7426], [RFC 2475], [NIST SP 800-215], [NIST SP 800-125B], [AWS docs], [unverified]

## Secure network components (4.2)
- Definition (ISC2 framing): outline 4.2 = operation of infrastructure (redundant power, warranty, support), transmission media (physical security, signal propagation quality), NAC systems (physical and virtual), endpoint security (host-based) [ISC2 outline]. Managerial view: availability of the gear, integrity of the wire, admission of the device, self-defense of the host.
- Key facts:
  - Operation of infrastructure: **redundant power** (dual PSUs, UPS, generator, separate feeds), **warranty** and vendor **support** contracts, spares, SLA response times = availability/maintenance controls; unsupported (EOL/EOS, D2) gear cannot be patched -> risk acceptance or replacement [unverified]. Hardening: change defaults, disable unused ports/services, SSH not Telnet, SNMPv3 not v1/v2c, config backups, signed firmware, OOB management [unverified]; firewall policy guidance in NIST SP 800-41 Rev 1 [NIST SP 800-41]
  - Devices [OSG glossary]:

  | Device | Layer | Security behavior |
  | --- | --- | --- |
  | **Repeater / hub** | 1 | repeats to all ports -> trivial sniffing; legacy |
  | **Bridge / switch** | 2 | switch forwards by MAC table, separate collision domains; **MAC flooding** degrades it to hub behavior |
  | **Router** | 3 | best-path selection, connects similar networks; static or dynamic routing |
  | **Multilayer (L3) switch** | 2–3 | routes between VLANs |
  | **Gateway** | up to 7 | connects networks using different protocols (translation) |
  | **Proxy** | 7 | copies packets, rewrites addresses (NAT/PAT), caches; forward vs reverse |
  | **Firewall** | varies | filters traffic; types in 7.7 |

  - Transmission media [OSG glossary]:

  | Medium | Traits | Security |
  | --- | --- | --- |
  | **UTP** | cheap, 100 m per segment; **attenuation**, **EMI**, crosstalk | tapping easy; emanations |
  | **STP** (shielded twisted pair) | foil shield vs EMI | same acronym as Spanning Tree Protocol |
  | **Coaxial** | legacy 10Base2/5 | |
  | **Fiber-optic** | glass/plastic, light; long distance, high throughput | no EMI, no RF emanation, tapping detectable [unverified] |
  | **Wireless** | RF | interception, jamming (SNR) |

  - Signal propagation quality = attenuation, EMI, crosstalk, noise -> effective SNR; **plenum**-rated cable for fire safety, not security [OSG glossary]; emanation control: **TEMPEST**, **control zone** (Faraday cage and/or white noise) [OSG glossary]; physical protection of cable runs: protective conduits, sealed connections, regular human inspections [OSG glossary]; wiring closets/IDFs in 3.9
  - **NAC** (network access control): controlling access to an environment through strict adherence to security policy; goals — prevent/reduce zero-day attacks, enforce policy throughout the network, use identities for access control [OSG glossary]; NIST: firewall feature granting access based on user credentials plus **health checks** of the client device [NIST SP 800-41]. Dimensions [unverified — verify OSG ch. 11]:

  | Axis | Options | Note | Example |
  | --- | --- | --- | --- |
  | Timing | **preadmission** (check before connect) vs **postadmission** (monitor behavior after) | | pre = posture check before the port opens; post = EDR flags the host, NAC moves it to quarantine |
  | Agent | agent-based vs agentless | agentless for guests/IoT | agentless = printer or visitor phone profiled by MAC/DHCP fingerprint |
  | Enforcement | **802.1X** port-based, DHCP/ARP control, inline appliance | quarantine/remediation VLAN, captive portal for guests | 802.1X assigns the VLAN; DHCP/ARP control blackholes an unknown MAC |
  | Scope | **physical** (switch ports, WLAN) vs **virtual** (VPN posture, cloud/VPC conditional access, hypervisor vSwitch) | outline names both | virtual = conditional access blocks an unmanaged device from the SaaS tenant |

  - **Endpoint security**: each device maintains local security whether or not the network protects it — "the end device is responsible for its own security" [OSG glossary]; **endpoint** = any device a worker uses to reach company resources, incl. IoT and ICS [OSG glossary]; **EDR** = evolution of antimalware — detect, record, evaluate, respond [OSG glossary]; host-based stack: HIDS/HIPS, host firewall, disk encryption, patching, application allow-listing, MDM/UEM [unverified]; NAC *checks* posture, endpoint security *provides* it; feeds zero trust tenet 5 (device posture)
- Exam traps / distractors:
  - **NAC** vs **802.1X**: 802.1X is one enforcement mechanism NAC may use; NAC = policy + posture + identity, broader. Example: NAC = laptop must present its machine cert AND show EDR running and current patches before landing on the user VLAN, else quarantine; 802.1X alone = only the cert check at the port
  - **NAC** (who may join) vs **firewall** (what traffic passes once joined) vs **IDS** (detects, does not admit). Example: NAC decides whether the laptop gets onto the user VLAN; the firewall decides whether that VLAN reaches the DB; the IDS only alerts when it does
  - **Preadmission** vs **postadmission**: "device found infected an hour after connecting" -> postadmission
  - **EDR** (behavioral detect + respond) vs antivirus (signature prevent) vs **HIDS** (detect only)
  - Warranty/support/redundant power = **availability** controls; a question asking for the "security" benefit of a support contract wants timely **patches/firmware**. Example: EOL core switch with a published management-plane RCE: no contract = no fix ever; the "security" value is the firmware, not the spare shipping overnight
  - **Hub** (everyone sees everything) vs **switch** (MAC flooding required to sniff); **fiber** answers any "emanations/EMI/tapping" question
  - **STP** = shielded twisted pair or Spanning Tree Protocol — read the context; **plenum** is fire code, not confidentiality
- Related terms: 802.1X/EAP (wireless entry), RADIUS/TACACS+ (4.3), zero trust posture (D3), EOL/EOS (2.5), physical security (3.9, 7.14), firewalls/IDS/IPS (7.7), patch management (7.8)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-41], [unverified]

## Secure communication channels (4.3)
- Definition (ISC2 framing): outline 4.3 = voice, video, collaboration (conferencing, virtual meeting rooms); remote access (network administrative functions); data communications (backhaul networks, satellite); third-party connectivity (telecom providers, hardware support) [ISC2 outline]. Principle: any channel you do not own is untrusted — authenticate the endpoints, encrypt above the carrier, and put the trust terms in a contract.
- Key facts:
  - **VoIP**: **SIP** (Session Initiation Protocol) = application-layer signaling to create, modify, terminate sessions [RFC 3261] [OSG glossary]; **RTP** carries media; **SRTP** adds confidentiality, message authentication, replay protection to RTP/RTCP [RFC 3711] [OSG glossary]; NIST SP 800-58 (Jan 2005) VoIP security [NIST SP 800-58]. Threats:

  | Threat | What | Control |
  | --- | --- | --- |
  | **Vishing** / **SPIT** | phishing / spam over VoIP, spoofed caller ID [OSG glossary] | awareness, caller authentication (STIR/SHAKEN [RFC 8224 §1]; FCC-mandated in IP networks by 30 Jun 2021 per TRACED Act [FCC]) |
  | Eavesdropping | plaintext RTP capture | **SRTP**, SIP over TLS (SIPS) |
  | **Toll fraud** / **phreaking** | abuse of **PBX** remote calling / dial tone [OSG glossary] | disable remote dial-in, strong PINs, call logging |
  | SIP manipulation | registration hijack, spoofed BYE, INVITE floods [RFC 3261 §26.1.1, §26.1.4, §26.1.5] | authenticate SIP, rate limit |
  | DoS / quality | latency and jitter sensitivity | QoS, voice VLAN |
  | VLAN hopping | voice VLAN -> data VLAN | 802.1Q hygiene, NAC on phone ports |

  - **Remote meeting** = digital collaboration, virtual meetings, videoconferencing, shared whiteboards, virtual training [OSG glossary]; **IM** risks: **spim** (spam over IM), malware via file transfer, data leakage [OSG glossary]; controls: authenticated join, waiting rooms/passcodes, end-to-end encryption vs provider-terminated TLS (Signal protocol = E2E [OSG glossary]), recording and retention policy, screen-share DLP [unverified]
  - Remote access types [OSG glossary]:

  | Type | Meaning | Control | Example |
  | --- | --- | --- | --- |
  | **Remote node operation** | client becomes a LAN member via VPN/dial-up/wireless through a **RAS** | NAC posture, full-tunnel policy | laptop on home Wi-Fi gets a corporate IP over the VPN client and is on the LAN |
  | **Remote control** | full control of a distant system; **RDP** TCP 3389 | never exposed directly — VPN or jump server | admin RDPs to a server; the laptop is only keyboard and screen |
  | **Screen scraping** | remote-desktop-like service (also automated UI parsing) | | published-app session: only pixels leave the DC |
  | **VDI** / virtual desktop | desktop hosted centrally; persistent vs nonpersistent | data stays in DC; BYOD-friendly | contractor's BYOD opens a pooled nonpersistent Windows desktop |
  | Service-specific / portal | access to one application (webmail) [NIST SP 800-46 §2.2.2: portal = server giving access to one or more applications via one interface] | least privilege | webmail or one SaaS app via a portal, nothing else routable |

  - Administrative functions: **jump server** (jumpbox) in extranets, screened subnets, cloud where a direct link is unsafe [OSG glossary]; **bastion host** = hardened to withstand attack [OSG glossary]; OOB console; MFA; PAM/session recording [unverified]; **callback** to a preconfigured number = secure, user-defined = insecure [OSG glossary]; **VPN concentrator** = hundreds–thousands of tunnels [OSG glossary]; NIST SP 800-46 Rev 2 telework/remote access/BYOD (Jul 2016) [NIST SP 800-46]; SP 800-53 **AC-17** Remote Access [NIST SP 800-53]
  - AAA protocols:

  | Protocol | Transport | Encryption | Use |
  | --- | --- | --- | --- |
  | **RADIUS** | UDP 1812/1813 [RFC 2865] | only the password attribute hidden [RFC 2865] | network access (dial-up, wireless, broadband) [OSG glossary] |
  | **TACACS+** | TCP 49 [RFC 8907] | whole packet body obfuscated [RFC 8907] | device administration; separates authentication/authorization/accounting [RFC 8907]; Cisco origin [OSG glossary] |
  | **Diameter** | TCP/SCTP with TLS/DTLS/IPsec [RFC 6733] | transport-secured | RADIUS successor; mobile/roaming [RFC 6733] |

  - VPN protocols [OSG glossary]:

  | Protocol | Encryption | Note |
  | --- | --- | --- |
  | **PPTP** | PPP enhancement, own tunnel | legacy, replaced by L2TP |
  | **L2TP** | **none** built in — relies on IPsec ESP | PPTP + L2F; layer 2 tunnel |
  | **IPsec** | AH/ESP, transport/tunnel | site-to-site and remote access; SP 800-77 |
  | **TLS VPN** / OpenVPN | TLS-based | browser portal, no special client — NIST SP 800-113 "Guide to SSL VPNs" (2008) [NIST SP 800-113] |
  | **GRE** | encapsulation only, **no encryption** | pair with IPsec |

  - Tunnel policy [OSG glossary]: **split tunnel** = corporate over VPN + internet direct (bypasses egress controls); **full tunnel** = everything through the org's egress; **remote access (host-to-site) VPN** vs **site-to-site VPN**
  - Data communications: **backhaul** = intermediate links carrying aggregated traffic from access/edge (cell sites, branch offices, Wi-Fi controllers) to the core/backbone [unverified — SP 800-187 §2 defines only the cellular sense: radio network to core]; often microwave, fiber, or satellite [NIST SP 800-187 §2, §3.6]; carrier backhaul encryption is operator-dependent (LTE S1 confidentiality is an operator option if "trusted") [NIST SP 800-187 §3.6] -> encrypt above it (IPsec/TLS) [unverified]; **satellite** = GEO latency, wide-footprint interception, third-party ground segment (orbits in wireless entry); SP 800-53 **SC-8** Transmission Confidentiality and Integrity [NIST SP 800-53]
  - Third-party connectivity: telecom carriers (MPLS/leased line = separation, not confidentiality), hardware vendor remote support, partner **extranets** [OSG glossary], cloud. Governance: **ISA** (interconnection security agreement) = document specifying security requirements for system interconnections incl. impact level of exchanged information [NIST SP 800-47]; NIST SP 800-47 Rev 1 "Managing the Security of Information Exchanges" (Jul 2021) [NIST SP 800-47]; SP 800-53 **CA-3** Information Exchange, **SC-7** Boundary Protection [NIST SP 800-53]. Vendor support access: dedicated VPN/jump path, time-bound JIT enablement, named accounts, session recording, disabled when idle [unverified]; control baseline = SP 800-53 **MA-4** Nonlocal Maintenance (approve/monitor, strong authentication, keep records, terminate sessions when done) [NIST SP 800-53]
    - Example: HVAC vendor support = VPN account enabled per ticket, through the jump server, session recorded, disabled at close; NOT a standing remote-desktop agent on the building controller
- Exam traps / distractors:
  - **SIP** (signaling) vs **RTP** (media) vs **SRTP** (secured media) — "calls set up but audio intercepted" -> SRTP
  - **Vishing** (phishing) vs **SPIT** (spam) — glossary cross-references them; **phreaking/toll fraud** is a PBX problem, not a network one
  - **RADIUS** (UDP, password-only encryption, network access) vs **TACACS+** (TCP, full-body encryption, split AAA -> router/switch admin). Example: RADIUS = Wi-Fi 802.1X and VPN logins; TACACS+ = per-command authorization on routers (allow show, deny configure)
  - **L2TP** "encrypts" -> no, IPsec does; **PPTP** as a recommended answer -> legacy; **GRE** = tunnel without crypto
  - **Split tunnel** lets malware reach the internet around corporate egress -> **full tunnel** or always-on when the question is about visibility/DLP
  - **TLS VPN** (clientless, application/portal scope) vs **IPsec VPN** (network-layer, full membership) — "contractor needs one web app" -> TLS portal. Example: TLS VPN = browser portal exposing only the timesheet app; IPsec VPN = the laptop gets a 10.x address and reaches every subnet the ACL allows
  - **Remote node** (join the LAN) vs **remote control** (drive a host) ; **jump server** (chokepoint for admin sessions) vs **bastion host** (any hardened exposed system). Example: jump server = the one hardened box admins SSH into before reaching any DC switch; bastion host = the public web server hardened to take abuse — a jump server is a bastion by role, not every bastion is a jump server
  - **ISA** (security requirements of the interconnection) vs **MOU/MOA** (intent and responsibilities) vs **SLA** (performance) vs **NDA** (confidentiality of information). Example: linking to a partner's claims system — ISA = "IPsec tunnel, TLS 1.2+, Moderate impact, who monitors"; MOU = "we will exchange claims data, each owns its side"; SLA = "99.9 % uptime"; NDA = "do not disclose what you see"
  - Carrier-provided **MPLS**/backhaul "is private, so encryption is unnecessary" -> wrong; **backhaul** vs **backbone** (edge-to-core vs core). Example: backhaul = the microwave hop from a cell tower or branch to the carrier's aggregation site; backbone = the carrier's core fiber between regions — both the carrier's, neither yours to trust
- Related terms: IPsec/TLS (first entry), satellite orbits and cellular (wireless entry), NAC (4.2), SCRM and vendor agreements (1.11, 1.8), egress monitoring (7.2), privileged account management (7.4), federation/SSO (5.2)
- Sources: [ISC2 outline], [OSG glossary], [RFC 3261], [RFC 3711], [RFC 2865], [RFC 8907], [RFC 6733], [RFC 8224], [FCC], [NIST SP 800-58], [NIST SP 800-46], [NIST SP 800-113], [NIST SP 800-47], [NIST SP 800-53], [NIST SP 800-187], [unverified]
