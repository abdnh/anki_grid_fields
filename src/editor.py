import aqt
from aqt.gui_hooks import (
    editor_will_load_note,
    editor_did_load_note,
    editor_did_init_buttons,
    editor_did_init_shortcuts,
    editor_did_init,
    add_cards_did_change_note_type
)

from .utils import grid_areas, toggle_mode, toggle_zoom


def show_grid(js, note, editor):
    grid_areas.model = note.model()
    value = grid_areas.value

    return f"{js}; gridFields.setCustomAreas(`{value}`); "

def on_add_cards_did_change_note_type(old, new):
    grid_areas.model = new
    value = grid_areas.value
    aqt.dialogs.open("AddCards").editor.web.eval(f"gridFields.setCustomAreas(`{value}`); ")


def add_column_number_input(righttopbtns, editor):
    righttopbtns.append(
        """
<label for="colCount">Cols:</label>
<input type="number" tabindex="-1" value="0" min="0" max="9" name="colCount" id="colCount" />
    """
    )


def toggle_mode_js(editor):
    editor.web.eval("gridFields.toggleGridFieldsMode(); ")


def toggle_zoom_js(editor):
    editor.web.eval("gridFields.toggleFieldZoom(); ")


def add_grid_fields_shortcuts(cuts, editor):
    cuts.extend(
        [
            (toggle_mode.value, lambda: toggle_mode_js(editor), True),
            (toggle_zoom.value, lambda: toggle_zoom_js(editor), True),
        ]
    )


def init_grid_css(editor):
    editor.web.eval("gridFields.setupColCount(); ")


def init_editor():
    editor_will_load_note.append(show_grid)
    add_cards_did_change_note_type.append(on_add_cards_did_change_note_type)
    editor_did_init_buttons.append(add_column_number_input)
    editor_did_init_shortcuts.append(add_grid_fields_shortcuts)
    editor_did_init.append(init_grid_css)
