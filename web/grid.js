const NoteEditor = require("anki/NoteEditor");

var gridFields = new (class {
  constructor() {
    this.style = document.createElement("style");
    this.zoomedField = null;
    document.head.appendChild(this.style);
  }

  getField(idx) {
    for(const [i, field] of Array.from(document.querySelector(".fields").children).entries()) {
      if(i == idx) return field;
    }
    return null;
  }

  getCurrentFieldOrdinal() {
    for(const [i, field] of Array.from(document.querySelector(".fields").children).entries()) {
      if(field.contains(document.activeElement)) return i;
    }
    return null;
  }

  async toggleFieldZoom() {
    const ord = this.getCurrentFieldOrdinal();

    if (typeof this.zoomedField === "number") {
      const oldEditorField = this.getField(this.zoomedField);
      oldEditorField.style.gridColumn = "";
      oldEditorField.style.zIndex = "";
      // TODO
      // oldEditorField.labelContainer.style.backgroundColor = "";

      if (this.zoomedField === ord) {
        // unzoom
        this.zoomedField = null;
        return;
      }
    }

    if (ord) {
      this.zoomedField = ord;

      const editorField = this.getField(this.zoomedField);
      editorField.style.gridColumn = "1 / -1";
      editorField.style.zIndex = "100";
      // editorField.labelContainer.style.backgroundColor = "var(--bg-color)";
    }
  }

  toggleGridFieldsMode() {
    if (this.defaultGrids) {
      bridgeCommand("getGridAreas", this.setCustomAreas.bind(this));
    } else {
      const colCount = document.getElementById("colCount");
      this.setColumnGrids(colCount.value);
    }
  }

  setupColCount() {
    setTimeout(() => {
      const colCount = document.getElementById("colCount");
      colCount.addEventListener("change", this.setColumnGridsEvent.bind(this));
    });
  }

  getFieldsTemplateColumnsCss(n) {
    const templateColumnsValue = Array.apply(0, Array(n))
      .map(() => "1fr")
      .join(" ");

    return `
.fields {
    grid-template-columns: ${templateColumnsValue};
}
`;
  }

  setDefaultColumnGrids() {
    const fields = document.getElementById("fields");

    this.defaultGrids = true;
    this.style.textContent = `
@media (max-width: 350px) { ${this.getFieldsTemplateColumnsCss(1)} }
`;

    if (fields.childElementCount >= 2) {
      this.style.textContent += `
@media (min-width: 350px) { ${this.getFieldsTemplateColumnsCss(2)} }
`;
    }

    if (fields.childElementCount >= 3) {
      this.style.textContent += `
@media (min-width: 700px) { ${this.getFieldsTemplateColumnsCss(3)} }
`;
    }

    if (fields.childElementCount >= 4) {
      this.style.textContent += `
@media (min-width: 1050px) { ${this.getFieldsTemplateColumnsCss(3)} }
`;
    }
  }

  setColumnGrids(value) {
    this.defaultGrids = true;

    switch (value) {
      case 0:
        bridgeCommand("getGridAreas", this.setCustomAreas.bind(this));
        break;
      default:
        this.style.textContent = this.getFieldsTemplateColumnsCss(value);
        break;
    }
  }

  setColumnGridsEvent(event) {
    const value = Number(event.currentTarget.value);
    this.setColumnGrids(value);
  }

  numberToGridArea(n) {
    return `
.fields > :nth-child(${n}) {
    grid-area: f${n};
}
`;
  }

  areasToCss(areas) {
    const lines = areas.split("\n").map((row) => row.split(/[ ]+/));

    const templateColumns = lines[0].map(() => "1fr").join(" ");

    const formatted = lines.map((row) => `"${row.join(" ")}"`).join("\n");

    return `
.fields {
grid-template-areas:
${formatted};
grid-template-columns: ${templateColumns};
}
`;
  }

  setCustomAreas(areas) {
    if (!areas) {
      const colCount = document.getElementById("colCount");
      this.setColumnGrids(colCount.value);
      return;
    }

    setTimeout(() => {
      let css = "";
      for (let i = 0; i < NoteEditor.instances[0].fields.length; i++) {
        css += this.numberToGridArea(i + 1);
      }
      css += this.areasToCss(areas);
      this.defaultGrids = false;
      this.style.textContent = css;
    });

  }
})();
