# Beyond Earth - NASA Space Habitat Designer

## 🚀 Project Overview


This project fulfills NASA's challenge to create an easy-to-use, accessible visual tool for creating and assessing space habitat layouts for the Artemis campaign and future Mars missions.

## ✅ NASA Requirements Implemented

### 1. **Educational Tutorial System**
- **Step 1**: Introduction to NASA's Artemis Campaign and space habitat importance
- **Step 2**: Three habitat construction types (Metallic, Inflatable, ISRU)
- **Step 3**: Functional areas and NASA design best practices

### 2. **Habitat Configuration System**
Users can configure:
- **Habitat Type**: Metallic, Inflatable, or In-Situ Resource Utilization (ISRU)
- **Shape**: Cylindrical, Spherical, Toroidal, or Modular
- **Launch Vehicle**: Falcon Heavy, SLS, Starship, or Custom
- **Destination**: Lunar Surface, Mars Surface, Deep Space, or Transit
- **Dimensions**: Width/diameter and height/length (with volume calculation)
- **Crew Size**: 1-8 astronauts
- **Mission Duration**: 7-730 days

### 3. **NASA-Standard Functional Areas**
13 functional areas based on NASA guidelines:

**Essential Areas** (Required):
- 🛏️ Sleep Quarters - Private rest areas
- 🚽 Hygiene & Waste - Sanitation facilities
- 🍽️ Food Prep - Galley and dining
- 👥 Common Area - Social gathering space

**Operational Areas** (Required):
- 🖥️ Workstation - Science and operations
- 🏥 Medical - Healthcare facilities
- 💪 Exercise - Physical fitness (critical in microgravity)
- 📦 Stowage - Supply storage

**Technical Areas** (Required):
- 🔧 Maintenance - Repair workshop
- ⚙️ ECLSS - Environmental Control & Life Support
- 🚪 Airlock - EVA operations

**Optional Areas**:
- 🎮 Recreation - Crew morale
- 🌱 Plant Growth - Fresh food production

### 4. **Real-Time Validation System**
The tool provides instant feedback:
- ✅ **Green**: Area meets NASA requirements
- ⚠️ **Yellow**: Warning - area slightly undersized or placement concern
- ❌ **Red**: Error - area too small or missing required area

Validation includes:
- Area size vs crew size and mission duration
- Adjacency rules (e.g., sleep quarters away from noisy areas)
- Separation rules (e.g., hygiene away from food prep)
- Required vs optional areas tracking

### 5. **Interactive Design Features**
- **Drag & Drop**: Drag functional areas from toolbar onto canvas
- **Visual Feedback**: Color-coded borders show validation status
- **Real-time Calculations**: Automatic area calculations in m²
- **Grid Background**: 50px = 1 meter for scale reference
- **Resizable Areas**: Adjust area sizes (future enhancement ready)
- **Export**: Save habitat designs as PNG images

### 6. **NASA Design Guidelines Integration**
The tool incorporates NASA best practices:
- Volume per crew: 25-50 m³ for long-duration missions
- Launch vehicle constraints (payload fairing dimensions)
- Functional area sizing based on crew and duration
- Zoning rules for area placement
- Mission-specific considerations

## 🎯 Key Features

1. **Easy to Use**: Intuitive drag-and-drop interface
2. **Educational**: Built-in tutorial explains NASA concepts
3. **Accessible**: Clean UI with visual feedback
4. **Practical**: Based on real NASA standards and data
5. **Iterative**: Easy to try different configurations
6. **Professional**: Suitable for students AND engineers

## 📊 Technical Implementation

### Data-Driven Design
- `FUNCTIONAL_AREA_REQUIREMENTS`: NASA-standard area requirements
- `HABITAT_CONFIGS`: Launch vehicle specs and habitat templates
- `DESTINATIONS`: Environment-specific considerations
- Volume calculations for different habitat shapes

### Validation Engine
- Real-time size validation
- Adjacency/separation rule checking
- Missing required areas detection
- Smart feedback messages

### User Experience
- Responsive design
- Space-themed UI with animations
- Tabbed toolbar for area categories
- Collapsible validation panel
- Configuration sidebar

## 🎓 Educational Value

The tool teaches users about:
- Space habitat design constraints
- Launch vehicle limitations
- Crew life support requirements
- Mission planning considerations
- NASA engineering standards
- Trade-offs in habitat design

## 🔄 Iterative Design Support

Users can easily:
- Change crew size and see updated requirements
- Modify mission duration and recalculate areas
- Switch between habitat types
- Try different layouts
- Export and compare designs

## 🌟 Future Enhancements (Ready for Implementation)

The codebase is prepared for:
- Resize handles on functional areas
- Multi-level habitat design
- Radial layouts around central core
- 3D visualization
- Community sharing features
- Advanced zoning visualization
- Path measurement between areas
- Object library (spacesuits, equipment, etc.)

## 📝 Usage

1. **Start**: Learn about NASA's mission in the tutorial
2. **Configure**: Set habitat parameters (type, size, crew, duration)
3. **Design**: Drag functional areas onto the canvas
4. **Validate**: Check real-time feedback (errors/warnings/success)
5. **Iterate**: Adjust layout based on NASA guidelines
6. **Export**: Save your design as an image

## 🎉 Mission Accomplished

This tool successfully addresses NASA's challenge by providing an accessible, educational, and practical habitat design tool that:
- ✅ Enables users to create overall habitat designs
- ✅ Determines functional area fit and placement
- ✅ Allows quick iteration of different options
- ✅ Considers multiple mission scenarios
- ✅ Provides real-time validation feedback
- ✅ Educates about space habitation

---

**Built for NASA Space Apps Challenge 2024/2025**
**"Beyond Earth" - Design the Future of Space Living** 🚀🌙🔴
