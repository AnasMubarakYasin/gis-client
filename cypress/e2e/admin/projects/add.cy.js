describe("add project", () => {
  beforeEach(() => {
    cy.visit("/admin/projects/something");
  });

  xit("test", () => {
    cy.get("[name=status]").parent().click();
    cy.get("[aria-labelledby=status] [data-value=Pembangunan]").click();
    cy.get("[name=status]").should("have.value", "Pembangunan");
  });

  it("should have form", {}, () => {
    cy.get("form").get("[for=input-image]").should("exist");
    cy.get("form").contains("label", "Nama Proyek");
    cy.get("form").contains("label", "Nama Perusahaan");
    cy.get("form").contains("label", "Nomor Kontrak");
    cy.get("form").contains("label", "Tanggal Kontrak");
    cy.get("form").contains("label", "Kegiatan");
    cy.get("form").contains("label", "Kendala");
    cy.get("form").contains("label", "Status");
    cy.get("form").contains("label", "Progress");
    cy.get("form").contains("label", "Sumber Dana");
    cy.get("form").contains("label", "Tahun Anggaran");
    cy.get("#submit-btn").should("exist");
  });

  it("should fill the form - positive case", {}, () => {
    // cy.get("[for=input-image]")
    cy.get("#input-image").selectFile("cypress/fixtures/proto-512.v2.png", {
      force: true,
    });
    cy.get("#output-image img").should("exist");

    cy.get("[name=name]")
      .type("Pembangunan Jalanan")
      .should("have.value", "Pembangunan Jalanan");

    cy.get("[name=name_company]")
      .type("Dinas Pembangunan")
      .should("have.value", "Dinas Pembangunan");

    cy.get("[name=contract_number]")
      .type("100100")
      .should("have.value", "100100");

    cy.get("[name=contract_date]")
      .parent()
      .get("[aria-label='Choose date']")
      .click();
    cy.get(
      `[aria-label="${new Intl.DateTimeFormat("default", {
        dateStyle: "medium",
      }).format(new Date())}"]`
    ).click();
    cy.get("[name=contract_date]").should(
      "have.value",
      new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date())
    );

    cy.get("[name=activity]").type("Bekerja").should("have.value", "Bekerja");
    cy.get("[name=obstacles]")
      .type("Kurang Dana")
      .should("have.value", "Kurang Dana");

    cy.get("[name=status]").parent().click();
    cy.get("[aria-labelledby=status] [data-value=Pembangunan]").click();
    cy.get("[name=status]").should("have.value", "Pembangunan");

    cy.get("[name=progress]").type("10").should("have.value", "10");
    cy.get("[name=fund_source]").type("Pajak").should("have.value", "Pajak");

    cy.get("[name=fiscal_year]").parent().click();
    cy.get("[aria-labelledby=fiscal_year] [data-value=2021]").click();
    cy.get("[name=fiscal_year]").should("have.value", "2021");

    cy.get("#submit-btn").click();
    cy.get('[role="alert"] .MuiAlert-message').should(
      "have.text",
      "Success Create"
    );
  });
});
