from aqt import QDialog, QLayout, QKeySequence, qtmajor

if qtmajor > 5:
    from .forms.settings_ui_qt6 import Ui_Settings
else:
    from .forms.settings_ui_qt5 import Ui_Settings


class Settings(QDialog):
    def __init__(self, addons, callback):
        super().__init__(parent=addons)

        self.ui = Ui_Settings()
        self.ui.setupUi(self)

        self.cb = callback

    def setupUi(self, toggle_mode_shortcut: str, toggle_zoom_shortcut: str):
        self.ui.toggleModeShortcut.setKeySequence(QKeySequence(toggle_mode_shortcut))
        self.ui.toggleZoomShortcut.setKeySequence(QKeySequence(toggle_zoom_shortcut))

    def accept(self):
        toggle_mode_shortcut = self.ui.toggleModeShortcut.keySequence().toString()
        toggle_zoom_shortcut = self.ui.toggleZoomShortcut.keySequence().toString()

        self.cb(toggle_mode_shortcut, toggle_zoom_shortcut)
        super().accept()
