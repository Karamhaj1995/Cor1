using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

enum SQLOptions { LOCAL, LiveFromLive, LiveFromLocal }

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]

public class WebService : System.Web.Services.WebService
{
    SQLOptions sqlop = SQLOptions.LiveFromLive;
    string myConStr = null;// = ConfigurationManager.ConnectionStrings["myConStr"].ConnectionString;
    SqlConnection connection = null;// = new SqlConnection(@"Data Source=DESKTOP-IOHHC7K\SQLEXPRESS;Initial Catalog=CityFix;Integrated Security=True");
    SqlCommand command;
    public WebService()
    {
        switch (sqlop)
        {
            case SQLOptions.LOCAL:
                myConStr = ConfigurationManager.ConnectionStrings["Local"].ConnectionString;
                break;
            case SQLOptions.LiveFromLive:
                myConStr = ConfigurationManager.ConnectionStrings["LiveConStrFromLive"].ConnectionString;
                break;
            case SQLOptions.LiveFromLocal:
                myConStr = ConfigurationManager.ConnectionStrings["LiveFromLocal"].ConnectionString;
                break;
            default:
                break;
        }
        connection = new SqlConnection(myConStr);
        command = new SqlCommand("", connection);
        //InitializeComponent(); 
    }

    [WebMethod]
    public string GetUserByNamePass(string usernameToLogin, string passwordToLogin)
    {
        command.Connection.Close();
        User userToLogin;
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText =
            "SELECT * " +
            "FROM Users " +
            "WHERE User_Name = @user_Name AND Password = @pass";
        command.Parameters.Add(new SqlParameter("@user_Name", usernameToLogin));
        command.Parameters.Add(new SqlParameter("@pass", passwordToLogin));
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        if (reader.Read())
        {
            userToLogin = new User()
            {
                Id = (int)reader["User_ID"],
                User_Name = reader["User_Name"].ToString(),
                Full_Name = reader["Full_Name"].ToString(),
                Birthday = (DateTime)reader["Birthday"],
                Password = reader["Password"].ToString(),
                ReportsCount = (int)reader["ReportCounts"],
                Picture = reader["Profile_Pic"].ToString()
            };
            command.Connection.Close();
            return json.Serialize(userToLogin);
        }
        command.Connection.Close();
        return json.Serialize("Not Exist");
    }
    [WebMethod]
    public string AddUserToDB(string uname, string name, DateTime br, string pass, string pic)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.Connection.Close();
        int isAdd = 0;
        command.CommandText = "Insert into Users (User_Name, Full_Name,Birthday,Password,ReportCounts,Profile_Pic) values(@UNAME,@NAME,@Birthday,@PASS,'0',@PIC)";
        command.Parameters.Add(new SqlParameter("@UNAME", uname));
        command.Parameters.Add(new SqlParameter("@NAME", name));
        command.Parameters.Add(new SqlParameter("@Birthday", br));
        command.Parameters.Add(new SqlParameter("@PASS", pass));
        command.Parameters.Add(new SqlParameter("@PIC", pic));
        command.Connection.Open();
        isAdd = command.ExecuteNonQuery();
        if (isAdd > 0)
        {
            command.Connection.Close();
            return json.Serialize("added");
        }
        else
        {
            command.Connection.Close();
            return json.Serialize("notadded");
        }
    }
    [WebMethod]
    public string CheckIfUserNameAvaible(string unamee)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.Connection.Close();
        command.CommandText = "select * from Users where User_Name = @uname";
        command.Parameters.Add(new SqlParameter("@uname", unamee));
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        if (reader.Read())
        {
            command.Connection.Close();
            return json.Serialize("Exist");
        }
        command.Connection.Close();
        return json.Serialize("Error");
    }
    [WebMethod]
    public string AddHazardToDB(int uid, string dt, int strid, string img, string des, float lat, float lng, string uname)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "INSERT INTO Hazards(Hazard_DateTime ,Street_ID ,Hazard_Image ,Descrption ,Hazard_Lat ,Hazard_Long, Hazard_Uploader) VALUES(@dt, @adr, @img, @des, @lat, @lng, @uname)";
        command.Parameters.Add(new SqlParameter("@dt", dt));
        command.Parameters.Add(new SqlParameter("@adr", strid + 1));
        command.Parameters.Add(new SqlParameter("@img", img));
        command.Parameters.Add(new SqlParameter("@des", des));
        command.Parameters.Add(new SqlParameter("@lat", lat));
        command.Parameters.Add(new SqlParameter("@lng", lng));
        command.Parameters.Add(new SqlParameter("@userid", uid));
        command.Parameters.Add(new SqlParameter("@user_id", uid));
        command.Parameters.Add(new SqlParameter("@uname", uname));
        command.Connection.Open();
        int isAdd = command.ExecuteNonQuery();
        //
        command.CommandText = "SELECT TOP 1 Hazard_ID FROM Hazards Order By Hazard_ID desc";
        SqlDataReader read = command.ExecuteReader();
        read.Read();
        command.Parameters.Add(new SqlParameter("@haz_id", read["Hazard_ID"].ToString()));
        command.CommandText = "INSERT INTO Users_Hazards(User_ID, Hazard_ID, User_Name, Hazard_Image, Description) VALUES (@user_id, @haz_id, @uname, @img, @des)";
        command.Connection.Close();
        command.Connection.Open();
        command.ExecuteNonQuery();
        if (isAdd > 0)
        {
            command.Connection.Close();
            return json.Serialize("Added"); ;
        }
        else
        {
            command.Connection.Close();
            return json.Serialize("Error");
        }


    }
    [WebMethod]
    public int NumberOfHazards()
    {
        command.CommandText = "select count(*) from Hazards";
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        if (reader.Read())
        {
            if ((int)reader.GetValue(0) != 0)
            {
                int count = (int)reader.GetValue(0);
                command.Connection.Close();
                return count;
            }
        }
        command.Connection.Close();
        return 0;
    }
    [WebMethod]
    public string ShowAllUsers()
    {
        ; string usersSTRING = "";
        command.Connection.Close();
        command.Connection.Open();
        command.CommandText = "select * from Users";
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
            usersSTRING += reader.GetValue(0).ToString() + " ";
            usersSTRING += reader.GetValue(1).ToString() + " ";
            usersSTRING += reader.GetValue(2).ToString() + " ";
            usersSTRING += Environment.NewLine;
        }
        command.Connection.Close();
        return usersSTRING;
    }
    [WebMethod]
    public string[] FillStreetLocationSelect()
    {
        string[] streetsNames = new string[20];
        command.Connection.Close();
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "select Street_Name from Streets";
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        int i = 0;
        while (reader.Read())
        {
            streetsNames[i++] = json.Serialize((reader["Street_Name"].ToString()).Trim('"'));
        }
        command.Connection.Close();
        return streetsNames;
    }
    [WebMethod]
    public string GetHazards()
    {
        List<Hazard> rh = new List<Hazard>();
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "select * from Hazards";
        command.Connection.Close();
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
            rh.Add(ReturnHazardFromReader(reader));
        }

        command.Connection.Close();
        return json.Serialize(rh);
    }

    private static Hazard ReturnHazardFromReader(SqlDataReader reader)
    {
        return new Hazard(
             int.Parse(reader[0].ToString()),
             (reader[1].ToString()),
             int.Parse(reader[2].ToString()),
             (reader[3].ToString()),
             (reader[4].ToString()),
             float.Parse(reader[5].ToString()),
             float.Parse(reader[6].ToString())
         );
    }
    [WebMethod]
    public string GetNews()
    {
        List<News> rh = new List<News>();
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "select * from News order by New_Date";
        command.Connection.Close();
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
            News hzr = new News(
                int.Parse(reader[0].ToString()),
                (DateTime)reader[2],
                (reader[1].ToString()),
                reader[3].ToString());
            rh.Add(hzr);
        }

        command.Connection.Close();
        return json.Serialize(rh);
    }
    [WebMethod]
    public string GetHazardsByUserID(int ID, int Top)
    {
        List<Hazard> rh = new List<Hazard>();
        JavaScriptSerializer json = new JavaScriptSerializer();
        int[] hazardsID = new int[Top];
        int i = 0;
        command.CommandText = "select Hazard_ID from Users_Hazards where User_ID = '" + ID + "'";
        command.Connection.Close();
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read() && i < Top)
        {
            hazardsID[i++] = Convert.ToInt16(reader[0]);
        }
        foreach (int id in hazardsID)
        {
            rh.Add(GetHazardsDetails(id));
        }
        command.Connection.Close();
        return json.Serialize(rh);
    }
    [WebMethod]
    public Hazard GetHazardsDetails(int id)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "select * from Hazards Where Hazard_ID = " + id.ToString();
        command.Connection.Close();
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        if (reader.Read())
            return ReturnHazardFromReader(reader);
        else
            return null;
    }
    [WebMethod]
    public string DeleteHazardByID(int HazardID, int UserID)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "Delete from Users_Hazards where Hazard_ID = " + HazardID + " and User_ID = " + UserID;

        command.Connection.Open();
        int isDeletedII = command.ExecuteNonQuery();
        command.Connection.Close();
        if (isDeletedII > 0)
        {
            command.CommandText = "select count(*) from Users_Hazards where Hazard_ID = " + HazardID;
            command.Connection.Open();
            SqlDataReader reader = command.ExecuteReader();
            reader.Read();
            if (Convert.ToInt16(reader[0]) == 0)
            {
                command.CommandText = "delete from Hazards where Hazard_ID = " + HazardID;
                command.Connection.Close();
                command.Connection.Open();
                command.ExecuteNonQuery();
                command.Connection.Close();
                return json.Serialize("DeletedII");
            }
            command.Connection.Close();
            return json.Serialize("Deleted");
        }
        else
        {
            command.Connection.Close();
            return json.Serialize("Error");
        }

    }
    [WebMethod]
    public string AddHazardToUser(int HazardID, int UserID, string UserName, string HazardImg, string Description)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();

        command.CommandText = "select count(*) from Users_Hazards where Hazard_ID = " + HazardID + " and User_ID = " + UserID;

        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        reader.Read();
        if (Convert.ToInt16(reader[0]) == 0)
        {
            command.Connection.Close();
            command.CommandText = "Insert into Users_Hazards(Hazard_ID, User_ID, User_Name, Hazard_Image, Description) values(@hid, @uid, @uname, @himg, @des)";
            command.Parameters.Add(new SqlParameter("@hid", HazardID));
            command.Parameters.Add(new SqlParameter("@uid", UserID));
            command.Parameters.Add(new SqlParameter("@uname", UserName));
            command.Parameters.Add(new SqlParameter("@himg", HazardImg));
            command.Parameters.Add(new SqlParameter("@des", Description));
            command.Connection.Open();
            int isAdded = command.ExecuteNonQuery();
            if (isAdded > 0)
            {
                command.Connection.Close();
                return json.Serialize("Added"); ;
            }
            else
            {
                command.Connection.Close();
                return json.Serialize("Error");
            }
        }
        else
        {
            command.Connection.Close();
            return json.Serialize("Already Exist");
        }

    }
    [WebMethod]
    public string NumberOfHazardsToUser(string userid)
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "select count(*) from Users_Hazards where User_ID = '" + userid + "'";
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        if (reader.Read())
        {
            if ((int)reader.GetValue(0) != 0)
            {
                int count = (int)reader.GetValue(0);
                command.Connection.Close();
                return json.Serialize(count);
            }
        }
        command.Connection.Close();
        return json.Serialize(0);
    }
    [WebMethod]
    public string SetDefaultSettingsToUser()
    {
        JavaScriptSerializer json = new JavaScriptSerializer();
        command.CommandText = "SELECT TOP 1 * FROM Users Order By User_ID desc";
        command.Connection.Open();
        SqlDataReader reader = command.ExecuteReader();
        reader.Read();
        int userID = (int)reader["User_ID"];
        command.Connection.Close();
        command.CommandText = "insert into Settings(User_ID, Raduis, Map_Interval, Notifcation) values(@userid, @radius, @interval, @notif)";
        command.Parameters.Add(new SqlParameter("@userid", userID.ToString()));
        command.Parameters.Add(new SqlParameter("@radius", "500"));
        command.Parameters.Add(new SqlParameter("@interval", "10"));
        command.Parameters.Add(new SqlParameter("@notif", "True"));
        command.Connection.Open();
        int idAdded = command.ExecuteNonQuery();
        command.Connection.Close();
        if (idAdded > 0)
        {
            return json.Serialize("added");
        }
        else
        {
            return json.Serialize("notAdded");
        }
    }

}

public class User
{
    public int Id { get; set; }
    public string User_Name { get; set; }
    public string Full_Name { get; set; }
    public DateTime Birthday { get; set; }
    public string Password { get; set; }
    public string Picture { get; set; }
    public int ReportsCount { get; set; }

    public User()
    {

    }

    public User(int i, string n, DateTime br, string p)
    {
        Id = i;
        Full_Name = n;
        Birthday = br;
        Password = p;
        ReportsCount = 0;
    }

    public override string ToString()
    {
        return "ID=" + Id + " FullName=" + Full_Name + " Birhday=" + Birthday.ToString();
    }

}

public class Hazard
{
    public int Hazard_ID { get; set; }
    public string Hazard_DateTime { get; set; }
    public int Street_ID { get; set; }
    public string Hazard_Image { get; set; }
    public string Hazard_Description { get; set; }
    public float Hazard_Lat { get; set; }
    public float Hazard_Long { get; set; }
    public Hazard()
    {

    }
    public Hazard(int hID, string hDT, int hADR, string hIMG, string hDES, float hLAT, float hLONG)
    {
        Hazard_ID = hID;
        Hazard_DateTime = hDT;
        Hazard_Image = hIMG;
        Street_ID = hADR;
        Hazard_Description = hDES;
        Hazard_Lat = hLAT;
        Hazard_Long = hLONG;
    }
}

class Users_Hazards
{
    public int User_ID { get; set; }
    public int Hazard_ID { get; set; }
    public string Hazard_Image { get; set; }
    public string User_Name { get; set; }
    public string Description { get; set; }

    public Users_Hazards(int IDHazard, int IDUser, string HazardIMG, string UserName, string Des)
    {
        User_ID = IDUser;
        Hazard_ID = IDHazard;
        Hazard_Image = HazardIMG;
        User_Name = UserName;
        Description = Des;
    }

}

class Returned_Hazard
{
    public int Hazard_ID { get; set; }
    public float Hazard_Lat { get; set; }
    public float Hazard_Long { get; set; }

    public Returned_Hazard(int nID, float nLat, float nLng)
    {
        Hazard_ID = nID;
        Hazard_Lat = nLat;
        Hazard_Long = nLng;
    }
}

class Streets
{
    public int Street_ID { get; set; }
    public string Street_Name { get; set; }

    public Streets()
    {

    }

    public Streets(int id, string name)
    {
        Street_ID = id;
        Street_Name = name;
    }
}

class News
{
    public int New_ID { get; set; }
    public string New_Header { get; set; }
    public DateTime New_Date { get; set; }
    public string New_Content { get; set; }
    public News(int nID, DateTime nDT, string nHDR, string nCNT)
    {
        New_ID = nID;
        New_Header = nHDR;
        New_Date = nDT;
        New_Content = nCNT;
    }
}