using hr_information_system_server.Models;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using OxyPlot;
using OxyPlot.Series;
using OxyPlot.SkiaSharp;

namespace hr_information_system_server.Functions
{
    public class ReportGenerator
    {
        public int TotalEmployees { get; set; }
        public List<Employee> EmployeesHiredWithinLast30Days { get; set; }
        public List<Employee> Employees { get; set; }

        public byte[] EmployeesHiredWithinLast30DaysPDF()
        {
            var document = new Document();

            Style style = document.Styles["Normal"];
            style.Font.Name = "Arial";
            style.Font.Size = 11;

            var section = document.AddSection();

            CreateHeader(section, "Employees Hired Within Last 30 Days");

            CreateEmployeeTable(section);

            CreateFooter(section);

            var renderer = new PdfDocumentRenderer(true)
            {
                Document = document
            };
            renderer.RenderDocument();

            using (var stream = new MemoryStream())
            {
                renderer.PdfDocument.Save(stream, false);
                return stream.ToArray();
            }
        }

        private void CreateEmployeeTable(Section section)
        {
            var table = section.AddTable();
            table.Borders.Width = 0.75;

            var column1 = table.AddColumn(Unit.FromCentimeter(1));
            var column2 = table.AddColumn(Unit.FromCentimeter(3));
            var column3 = table.AddColumn(Unit.FromCentimeter(3));
            var column4 = table.AddColumn(Unit.FromCentimeter(6));
            var column5 = table.AddColumn(Unit.FromCentimeter(3));

            var row = table.AddRow();
            row.Shading.Color = Colors.Navy;
            row.Format.Font.Color = Colors.White;
            row.Cells[0].AddParagraph("ID");
            row.Cells[1].AddParagraph("First Name");
            row.Cells[2].AddParagraph("Last Name");
            row.Cells[3].AddParagraph("Email");
            row.Cells[4].AddParagraph("Position");

            foreach (var employee in EmployeesHiredWithinLast30Days)
            {
                var dataRow = table.AddRow();
                dataRow.Cells[0].AddParagraph(employee.Id.ToString());
                dataRow.Cells[1].AddParagraph(employee.FirstName);
                dataRow.Cells[2].AddParagraph(employee.LastName);
                dataRow.Cells[3].AddParagraph(employee.Email);
                dataRow.Cells[4].AddParagraph(employee.Position);
            }
        }

        public byte[] TotalEmployeesPDF()
        {
            var document = new Document();

            Style style = document.Styles["Normal"];
            style.Font.Name = "Arial";
            style.Font.Size = 11;

            var section = document.AddSection();

            CreateHeader(section, $"Total Employees");

            AddEmployeePieChart(section);

            CreateFooter(section);

            var renderer = new PdfDocumentRenderer(true)
            {
                Document = document
            };
            renderer.RenderDocument();

            using (var stream = new MemoryStream())
            {
                renderer.PdfDocument.Save(stream, false);
                return stream.ToArray();
            }
        }

        private void AddEmployeePieChart(Section section)
        {
            var chartImagePath = GeneratePieChartImage();

            var imageParagraph = section.AddParagraph();
            imageParagraph.Format.Alignment = ParagraphAlignment.Center;
            imageParagraph.AddImage(chartImagePath);
        }

        private string GeneratePieChartImage()
        {
            var plotModel = new PlotModel { Title = $"{TotalEmployees} employees" };

            var pieSeries = new PieSeries
            {
                StrokeThickness = 0.0,
                InsideLabelPosition = 0.5,
                AngleSpan = 360,
                StartAngle = 0,
                FontSize = 14,
                InsideLabelColor = OxyColors.White
            };

            int hrAdminNum = Employees.Where(e => e.IsHRAdmin).Count();
            int employeeNum = Employees.Where(e => !e.IsHRAdmin).Count();

            pieSeries.Slices.Add(new PieSlice("HR Administrator", hrAdminNum) { Fill = OxyColors.Chocolate });
            pieSeries.Slices.Add(new PieSlice("Employee", employeeNum) { Fill = OxyColors.RoyalBlue });

            plotModel.Series.Add(pieSeries);

            var imagePath = Path.Combine(Path.GetTempPath(), "employee_pie_chart.png");

            using (var stream = File.Create(imagePath))
            {
                var pngExporter = new PngExporter { Width = 600, Height = 400 };
                pngExporter.Export(plotModel, stream);
            }

            return imagePath;
        }

        private void CreateHeader(Section section, string title)
        {
            var header = section.Headers.Primary.AddParagraph();
            header.AddText(title);
            header.Format.Font.Size = 16;
            header.Format.Font.Color = Colors.White;
            header.Format.Alignment = ParagraphAlignment.Center;
            header.Format.SpaceAfter = "1cm";

            section.Headers.Primary.Format.Shading.Color = Colors.Navy;
        }

        private void CreateFooter(Section section)
        {
            var footer = section.Footers.Primary.AddParagraph();
            footer.AddText("Generated on: " + DateTime.Now.ToString("MMMM dd, yyyy"));
            footer.Format.Font.Size = 10;
            footer.Format.Font.Color = Colors.White;
            footer.Format.Alignment = ParagraphAlignment.Center;

            section.Footers.Primary.Format.Shading.Color = Colors.Navy;
        }
    }
}
