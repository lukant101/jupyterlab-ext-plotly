import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';

import {
  ICommandPalette,
  MainAreaWidget,
  ToolbarButton
} from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

/**
 * Initialization data for the plotly-extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'plotly-extension:plugin',
  description: 'Take home test from Plotly',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    notebookTracker: INotebookTracker
  ) => {
    const newWidget = () => {
      const content = new Widget();
      content.addClass('plotly-widget');
      const widget = new MainAreaWidget({ content });
      widget.id = 'plotly-extension';
      widget.title.label = 'Plotly Dialog';
      widget.title.closable = true;

      const dialog = document.createElement('dialog');
      dialog.open = true;

      const para = document.createElement('p');

      const input = document.createElement('input');
      input.type = 'text';

      const button = document.createElement('button');
      button.addEventListener('click', e => {
        para.innerText = `You have entered: ${input.value}`;
        dialog.close();
      });
      button.innerText = 'OK';

      dialog.appendChild(input);
      dialog.appendChild(button);

      content.node.appendChild(dialog);
      content.node.appendChild(para);

      return widget;
    };
    let widget = newWidget();

    const command: string = 'plotly-extension:open-dialog';
    app.commands.addCommand(command, {
      label: 'Plotly Dialog',
      execute: () => {
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Custom Plotly' });

    let button = new ToolbarButton({
      label: 'Plotly Dialog',
      onClick: () => {
        const command = 'plotly-extension:open-dialog';
        app.commands.execute(command);
      }
    });

    // Add the button to the notebook panel toolbar
    notebookTracker.widgetAdded.connect((sender, panel) => {
      if (panel instanceof NotebookPanel) {
        panel.toolbar.addItem('Plotly Dialog', button);
      }
    });
  }
};

export default plugin;
