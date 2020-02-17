using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using Microsoft.VisualBasic.ApplicationServices;
namespace client
{

    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(String[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Form1 mf = new Form1(args);
            using (NotifyIcon icon = new NotifyIcon())
            {
                icon.Icon = System.Drawing.Icon.ExtractAssociatedIcon(Application.ExecutablePath);
                icon.ContextMenu = new ContextMenu(new MenuItem[] {
                new MenuItem("Exit", (s, e) => { Application.Exit(); }),
            });
                icon.Visible = true;
                SingleInstanceAppStarter.Start(mf, StartNewInstance);
                icon.Visible = false;
            }
          
        }

        private static void StartNewInstance(object sender, StartupNextInstanceEventArgs e)
        {
            String cmdArg = e.CommandLine[1]; // yes, 1 to get the first.  not zero.
        }

        class SingleInstanceAppStarter
        {
            static SingleInstanceApp app = null;

            public static void Start(Form f, StartupNextInstanceEventHandler handler)
            {
                if (app == null && f != null)
                {
                    app = new SingleInstanceApp(f);
                }
                app.StartupNextInstance += handler;
                app.Run(Environment.GetCommandLineArgs());
            }
        }

        class SingleInstanceApp : WindowsFormsApplicationBase
        {
            public SingleInstanceApp() { }

            public SingleInstanceApp(Form f)
            {
                base.IsSingleInstance = true;
                this.MainForm = f;
            }
        }
    }
}  
