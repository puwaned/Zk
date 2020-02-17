using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using Microsoft.VisualBasic.ApplicationServices;
namespace client
{

    static class Program
    {
        static Form1 MainForm;
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] Args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            MainForm = new Form1(Args);
           

            using (NotifyIcon icon = new NotifyIcon())
            {
                icon.Icon = System.Drawing.Icon.ExtractAssociatedIcon(Application.ExecutablePath);
                icon.ContextMenu = new ContextMenu(new MenuItem[] {
                new MenuItem("Exit", (s, e) => { Application.Exit(); }),
            });
                icon.Visible = true;
                SingleInstanceApplication.Run(MainForm, NewInstanceHandler);
                icon.Visible = false;
            }
        }

        public static void NewInstanceHandler(object sender, StartupNextInstanceEventArgs e)
        {
            //You can add a method on your Form1 class to notify it has been started again   
            //and perhaps pass parameters to it. That is if you need to know for instance    
            //the startup parameters.   

            //MainForm.NewInstance(e);   

            e.BringToForeground = false;
        }

        public class SingleInstanceApplication : WindowsFormsApplicationBase
        {
            private SingleInstanceApplication()
            {
                base.IsSingleInstance = true;
            }

            public static void Run(Form f, StartupNextInstanceEventHandler startupHandler)
            {
                SingleInstanceApplication app = new SingleInstanceApplication();
                app.MainForm = f;
                app.StartupNextInstance += startupHandler;
                app.Run(Environment.GetCommandLineArgs());
            }
        }
    }
}  
