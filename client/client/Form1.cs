using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using AxZKFPEngXControl;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace client
{
    public partial class Form1 : Form
    {
        private AxZKFPEngX ZkFprint = new AxZKFPEngX();
        //private string _argument;
        private string Argument;
        
        public Form1(string[] Args)
        {
            this.WindowState = FormWindowState.Minimized;
            InitializeComponent();
            if(Args.Length > 0)
            {
                Argument = Args[0];
            }
        }

        private void zkFprint_OnEnroll(object sender, IZKFPEngXEvents_OnEnrollEvent e)
        {
            /*if (e.actionResult)
            {
                string template = ZkFprint.EncodeTemplate1(e.aTemplate);
                string secret = generateSecret();
                con = new OleDbConnection("Provider=Microsoft.ACE.Oledb.12.0;Data Source=userDB.accdb");
                string sql = $"INSERT INTO user_data(finger_value,secret,voted)VALUES('{template}','{secret}',0)";
                try
                {
                    con.Open();
                    OleDbCommand cmd = new OleDbCommand(sql, con);
                    cmd.ExecuteNonQuery();
                    ShowHintInfo("Registration successful. You can verify now");
                    socket.Emit("response_from_server", convertToJson("enroll", "success"));
                    socket.Emit("response_from_server", convertToJson("enroll", secret));
                }
                catch (Exception err)
                {
                    ShowHintInfo(err.Message);
                    socket.Emit("response_from_server", convertToJson("enroll", "fail"));
                }
                finally
                {
                    con.Close();
                    ZkFprint.CancelEnroll();
                }
            }
            else
            {
                ShowHintInfo("Error, please register again.");
                socket.Emit("response_from_server", convertToJson("enroll", "fail"));
            }*/
        }

        private void zkFprint_OnFeatureInfo(object sender, IZKFPEngXEvents_OnFeatureInfoEvent e)
        {
           /* String strTemp = string.Empty;
            if (ZkFprint.EnrollIndex != 1)
            {
                if (ZkFprint.IsRegister)
                {
                    if (ZkFprint.EnrollIndex - 1 > 0)
                    {
                        int eindex = ZkFprint.EnrollIndex - 1;
                        strTemp = "Please scan again ..." + eindex;
                        if (eindex == 2)
                        {
                            socket.Emit("response_from_server", convertToJson("enroll", "enroll_count2"));
                        }
                        if (eindex == 1)
                        {
                            socket.Emit("response_from_server", convertToJson("enroll", "enroll_count1"));
                        }
                    }
                }
            }*/
        }

        private void zkFprint_OnImageReceived(object sender, IZKFPEngXEvents_OnImageReceivedEvent e)
        {
            /*Graphics g = finger_image.CreateGraphics();
            Bitmap bmp = new Bitmap(finger_image.Width, finger_image.Height);
            g = Graphics.FromImage(bmp);
            int dc = g.GetHdc().ToInt32();
            ZkFprint.PrintImageAt(dc, 0, 0, bmp.Width, bmp.Height);
            g.Dispose();
            finger_image.Image = bmp;*/
        }

        private void InitialAxZkfp()
        {
            try
            {
                ZkFprint.OnImageReceived += zkFprint_OnImageReceived;
                ZkFprint.OnFeatureInfo += zkFprint_OnFeatureInfo;
                ZkFprint.OnEnroll += zkFprint_OnEnroll;
                if (ZkFprint.InitEngine() == 0)
                {
                    ZkFprint.FPEngineVersion = "10";
                    ZkFprint.EnrollCount = 3;
                }
                else
                {
                    ZkFprint.EndEngine(); 
                }
            }
            catch (Exception e)
            {
                //device_status.Text = "device init error: " + e.Message;
            }
        }

        public void writeResult(string result)
        {
            FileInfo fileusername = new FileInfo($"result.txt");
            StreamWriter namewriter = fileusername.CreateText();
            namewriter.Write($"{result}");
            namewriter.Close();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Controls.Add(ZkFprint);
            Hide();
            InitialAxZkfp();
            switch(Argument)
            {
                case "check_device":
                    try
                    {
                        if (ZkFprint.InitEngine() == 0)
                        {
                            writeResult("true");
                        }
                        else
                        {
                            writeResult("false");
                        }
                    }
                    catch (Exception err)
                    {
                        writeResult(err.Message);
                    }
                    finally
                    {
                        Application.Exit();
                    }
                    break;
                case "verify":
                    break;
                case "":
                    break;
            }
        }
    }
}