using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.IO;

namespace client
{
    public partial class Form1 : Form
    {
        public Form1(string[] Args)
        {
            InitializeComponent();
            if(Args.Length > 0)
            {
                writeResult(Args[0].ToString());
                this.Close();
            }
        }

        public void writeResult(string result)
        {
            FileInfo fileusername = new FileInfo($"result.txt");
            StreamWriter namewriter = fileusername.CreateText();
            namewriter.Write($"{result}");
            namewriter.Close();
        }
    }
}
