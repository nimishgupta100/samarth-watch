# Private demo accounts (do NOT commit, do NOT show on any page)

These are the only accounts and people in the live app.

Care Coordinator
- role: coordinator
- username: nimishgupta100
- password: nimish200
- store only a salted hash (Web Crypto) in the seed data, never the plain text

Senior
- role: senior
- name: Kamla
- mobile: 7452009877
- assigned coordinator: nimishgupta100

Family member
- role: family
- name: Karishma
- mobile: 8765789433
- linked to senior Kamla, shown only as "Family member" (relationship not given)

Not provided yet (do not invent): coordinator phone number and display name, Operations Manager account, Kamla's age, city, address, living situation, language and medicines, Karishma's relationship.

Note for the owner: these phone numbers and the password were typed into a chat. Use fake numbers and a new password for any public deployment. In a no-backend app everything in the browser bundle can be inspected.
