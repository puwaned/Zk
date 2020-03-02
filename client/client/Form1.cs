using System;
using System.Collections.Generic;
using System.Data;
using AxZKFPEngXControl;
using System.Windows.Forms;
using System.IO;
using System.Data.OleDb;

namespace client
{
    public partial class Form1 : Form
    {
        private AxZKFPEngX ZkFprint = new AxZKFPEngX();
        private bool Check;
        private string Argument;
        private string Sub_Argument;
        OleDbConnection con;
        OleDbDataAdapter da;
        DataSet ds;

        public Form1(string[] Args)
        {
            this.WindowState = FormWindowState.Minimized;
            InitializeComponent();
            if (Args.Length == 1)
            {
                Argument = Args[0];
            }
            else
            {
                Argument = Args[0];
                Sub_Argument = Args[1];
            }
        }

        private List<User> queryFingerTemplete()
        {

            con = new OleDbConnection("Provider=Microsoft.ACE.Oledb.12.0;Data Source=userDB.accdb");
            da = new OleDbDataAdapter($"SELECT * FROM user_data", con);
            var templetes = new List<User>();
            ds = new DataSet();
            try
            {
                con.Open();
                da.Fill(ds, "user_data");
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    templetes.Add(new User(Int32.Parse(ds.Tables[0].Rows[i]["id"].ToString()), ds.Tables[0].Rows[i]["finger_value"].ToString(), ds.Tables[0].Rows[i]["secret"].ToString(), ds.Tables[0].Rows[i]["voted"].ToString()));
                }
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
            finally
            {
                con.Close();
            }
            return templetes;
        }

        private void updateVoteStatus(int id)
        {
            con = new OleDbConnection("Provider=Microsoft.ACE.Oledb.12.0;Data Source=userDB.accdb");
            
            string query = "UPDATE [user_data] SET [voted] = ? WHERE ID = ?";
            try
            {
                con.Open();
                var accessUpdateCommand = new OleDbCommand(query, con);
                accessUpdateCommand.Parameters.AddWithValue("voted", -1);
                accessUpdateCommand.Parameters.AddWithValue("ID", id);
                da = new OleDbDataAdapter();
                da.UpdateCommand = accessUpdateCommand;
                da.UpdateCommand.ExecuteNonQuery();
                writeResult("update_status", "true");
            }
            catch (Exception e)
            {
                writeResult("update_status", e.Message);
            }
            finally
            {
                con.Close();
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

        private void zkFprint_OnCapture(object sender, IZKFPEngXEvents_OnCaptureEvent e)
        {
            string template = ZkFprint.EncodeTemplate1(e.aTemplate);
            writeResult("finger", template);
            ZkFprint.CancelCapture();
            Application.Exit();
        }

        private void fetch_Finger(string finger)
        {
            List<User> temp = queryFingerTemplete();
            bool Match = false;
            bool Voted = true;
            string Secret = "";
            string Id = "";
            for (int i = 0; i < temp.Count; i++)
            {
                if (ZkFprint.VerFingerFromStr(ref finger, temp[i].finger, false, ref Check))
                {
                    Match = true;
                    ZkFprint.CancelCapture();
                    if (temp[i].voted == false.ToString())
                    {
                        Secret = temp[i].secret;
                        Id = temp[i].id.ToString();
                        Voted = false;
                    }
                    else
                    {
                        Voted = true;
                    }
                }
            }
            if (Match)
            {
                if (Voted)
                {
                    writeResult("verify", "{" + "\"status\"" + ":" + "\"voted\"" + "}");
                }
                else
                {
                    writeResult("verify", "{" + "\"status\"" + ":" + "true" + "," + "\"id\"" + ":" + Id + "," + "\"secret\"" + ":" + "\"" + Secret + "\"" + "}");
                }
            }
            else
            {
                writeResult("verify", "{" + "\"status\"" + ":" + "false" + "}");
            }
            Application.Exit();
        }

        /*private void zkFprint_OnCapture(object sender, IZKFPEngXEvents_OnCaptureEvent e)
        {
            template = ZkFprint.EncodeTemplate1(e.aTemplate);
            List<User> temp = queryFingerTemplete();
            bool isMatch = false;
            bool duplicate = false;
            string secret = "";

            for (int i = 0; i < temp.Count; i++)
            {
                if (ZkFprint.VerFingerFromStr(ref template, temp[i].finger, false, ref Check))
                {
                    isMatch = true;

                    ZkFprint.CancelCapture();
                    if (temp[i].voted == false.ToString())
                    {
                        secret = temp[i].secret;
                    }
                    else
                    {
                        duplicate = true;
                    }
                }
            }

            if (!isMatch)
            {
                ZkFprint.CancelCapture();
                writeResult("verify","fail");
                Application.Exit();
            }
            else if (duplicate == true)
            {
                ZkFprint.CancelCapture();
                writeResult("verify", "voted");
                Application.Exit();
            }
            else if (isMatch && !duplicate)
            {
                ZkFprint.CancelCapture();
                writeResult("verify", secret);
                Application.Exit();
            }
        }*/

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

        public void writeResult(string tag, string result)
        {
            FileInfo fileusername = new FileInfo($"{tag}.txt");
            StreamWriter namewriter = fileusername.CreateText();
            namewriter.Write($"{result}");
            namewriter.Close();
        }

        public class User
        {
            public int id { get; set; }
            public string finger { get; set; }
            public string secret { get; set; }
            public string voted { get; set; }
            public User(int i, string f, string s, string v)
            {
                id = i;
                finger = f;
                secret = s;
                voted = v;
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Controls.Add(ZkFprint);
            Hide();
            InitialAxZkfp();
            switch (Argument)
            {
                case "check_device":
                    try
                    {
                        if (ZkFprint.InitEngine() == 0)
                        {
                            writeResult("check_device", "true");
                        }
                        else
                        {
                            writeResult("check_device", "false");
                        }
                    }
                    catch (Exception err)
                    {
                        writeResult("check_device", err.Message);
                    }
                    finally
                    {
                        Application.Exit();
                    }
                    break;
                case "verify_1":
                    if (ZkFprint.IsRegister)
                    {
                        ZkFprint.CancelEnroll();
                    }
                    ZkFprint.OnCapture += zkFprint_OnCapture;
                    ZkFprint.BeginCapture();
                    break;
                case "verify_2":
                    fetch_Finger(Sub_Argument);
                    break;
                case "done":
                    updateVoteStatus(Int32.Parse(Sub_Argument));
                    Application.Exit();
                    break;
                case "get_secret_key":
                    string json = "";
                    List<User> users = queryFingerTemplete();
                    for (int i = 0; i < users.Count; i++)
                    {
                        if(i == users.Count - 1)
                        {
                            json += users[i].secret;
                        }
                        else
                        {
                            json += users[i].secret + ",";
                        }
                    }
                    writeResult("secret_key", json);
                    Application.Exit();
                    break;
            }


        }
    }
}