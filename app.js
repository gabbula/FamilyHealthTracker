// Family Health Tracker App
class FamilyHealthTracker {
    // BMI category thresholds
    static BMI_THRESHOLDS = {
        UNDERWEIGHT: 18.5,
        NORMAL: 25,
        OVERWEIGHT: 30
    };

    constructor() {
        this.profiles = this.loadProfiles();
        this.currentProfile = null;
        this.editingProfile = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProfiles();
        this.setDefaultDate();
    }

    setupEventListeners() {
        // Profile management
        document.getElementById('add-profile-btn').addEventListener('click', () => this.showProfileModal());
        document.getElementById('profile-form').addEventListener('submit', (e) => this.saveProfile(e));
        document.getElementById('cancel-profile-btn').addEventListener('click', () => this.closeProfileModal());
        
        // BMI management
        document.getElementById('bmi-form').addEventListener('submit', (e) => this.saveBMI(e));
        document.getElementById('back-to-profiles-btn').addEventListener('click', () => this.showProfileSection());
        document.getElementById('compare-btn').addEventListener('click', () => this.showComparison());
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('entry-date');
        dateInput.value = today;
        dateInput.setAttribute('max', today);
    }

    // Profile Management
    loadProfiles() {
        try {
            const saved = localStorage.getItem('familyProfiles');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading profiles from localStorage:', error);
            alert('Unable to load saved profiles. Your browser may have storage disabled.');
            return [];
        }
    }

    saveProfilesToStorage() {
        try {
            localStorage.setItem('familyProfiles', JSON.stringify(this.profiles));
        } catch (error) {
            console.error('Error saving profiles to localStorage:', error);
            alert('Unable to save profiles. Your browser storage may be full or disabled.');
        }
    }

    showProfileModal(profile = null) {
        this.editingProfile = profile;
        const modal = document.getElementById('profile-modal');
        const title = document.getElementById('modal-title');
        
        if (profile) {
            title.textContent = 'Edit Family Member';
            document.getElementById('profile-name').value = profile.name;
            document.getElementById('profile-age').value = profile.age;
            document.getElementById('profile-gender').value = profile.gender;
            document.getElementById('profile-ethnicity').value = profile.ethnicity;
        } else {
            title.textContent = 'Add Family Member';
            document.getElementById('profile-form').reset();
        }
        
        modal.style.display = 'block';
    }

    closeProfileModal() {
        document.getElementById('profile-modal').style.display = 'none';
        document.getElementById('profile-form').reset();
        this.editingProfile = null;
    }

    saveProfile(e) {
        e.preventDefault();
        
        const profileData = {
            id: this.editingProfile ? this.editingProfile.id : Date.now(),
            name: document.getElementById('profile-name').value,
            age: parseInt(document.getElementById('profile-age').value),
            gender: document.getElementById('profile-gender').value,
            ethnicity: document.getElementById('profile-ethnicity').value,
            bmiData: this.editingProfile ? this.editingProfile.bmiData : []
        };
        
        if (this.editingProfile) {
            const index = this.profiles.findIndex(p => p.id === this.editingProfile.id);
            this.profiles[index] = profileData;
        } else {
            this.profiles.push(profileData);
        }
        
        this.saveProfilesToStorage();
        this.renderProfiles();
        this.closeProfileModal();
    }

    deleteProfile(profileId) {
        if (confirm('Are you sure you want to delete this profile? All BMI data will be lost.')) {
            this.profiles = this.profiles.filter(p => p.id !== profileId);
            this.saveProfilesToStorage();
            this.renderProfiles();
        }
    }

    renderProfiles() {
        const container = document.getElementById('profile-list');
        
        if (this.profiles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No family members added yet.</p>
                    <p>Click "Add Family Member" to get started!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.profiles.map(profile => `
            <div class="profile-card">
                <h3>${this.escapeHtml(profile.name)}</h3>
                <p>👤 Age: ${profile.age}</p>
                <p>⚧ Gender: ${this.capitalize(profile.gender)}</p>
                <p>🌍 Ethnicity: ${this.capitalize(profile.ethnicity)}</p>
                <p>📊 BMI Records: ${profile.bmiData.length}</p>
                <div class="profile-actions">
                    <button class="btn-view" data-profile-id="${profile.id}">View</button>
                    <button class="btn-edit" data-profile-id="${profile.id}">Edit</button>
                    <button class="btn-delete" data-profile-id="${profile.id}">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Add event delegation for profile actions
        container.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => this.viewProfile(parseInt(btn.dataset.profileId)));
        });
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const profile = this.profiles.find(p => p.id === parseInt(btn.dataset.profileId));
                this.showProfileModal(profile);
            });
        });
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => this.deleteProfile(parseInt(btn.dataset.profileId)));
        });
    }

    viewProfile(profileId) {
        this.currentProfile = this.profiles.find(p => p.id === profileId);
        if (this.currentProfile) {
            document.getElementById('profile-section').style.display = 'none';
            document.getElementById('bmi-section').style.display = 'block';
            document.getElementById('current-profile-name').textContent = `${this.currentProfile.name}'s BMI Data`;
            this.renderBMIHistory();
            this.setDefaultDate();
        }
    }

    showProfileSection() {
        document.getElementById('profile-section').style.display = 'block';
        document.getElementById('bmi-section').style.display = 'none';
        document.getElementById('bmi-result').style.display = 'none';
        document.getElementById('bmi-form').reset();
        this.currentProfile = null;
    }

    // BMI Calculations
    calculateBMI(weight, height) {
        // Validate inputs
        if (!weight || !height || weight <= 0 || height <= 0) {
            throw new Error('Weight and height must be positive numbers');
        }
        
        // height in cm, convert to meters
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    }

    getBMICategory(bmi) {
        const { UNDERWEIGHT, NORMAL, OVERWEIGHT } = FamilyHealthTracker.BMI_THRESHOLDS;
        if (bmi < UNDERWEIGHT) return 'Underweight';
        if (bmi < NORMAL) return 'Normal weight';
        if (bmi < OVERWEIGHT) return 'Overweight';
        return 'Obese';
    }

    getBMICategoryColor(bmi) {
        const { UNDERWEIGHT, NORMAL, OVERWEIGHT } = FamilyHealthTracker.BMI_THRESHOLDS;
        if (bmi < UNDERWEIGHT) return '#ffa726'; // orange
        if (bmi < NORMAL) return '#66bb6a'; // green
        if (bmi < OVERWEIGHT) return '#ffa726'; // orange
        return '#ef5350'; // red
    }

    saveBMI(e) {
        e.preventDefault();
        
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const date = document.getElementById('entry-date').value;
        
        // Validate date is not in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
            alert('Cannot enter BMI data for future dates. Please select today or an earlier date.');
            return;
        }
        
        try {
            const bmi = this.calculateBMI(weight, height);
            const category = this.getBMICategory(parseFloat(bmi));
            
            const bmiEntry = {
                id: Date.now(),
                weight,
                height,
                bmi: parseFloat(bmi),
                category,
                date
            };
            
            this.currentProfile.bmiData.unshift(bmiEntry);
            
            // Update profile in main array
            const profileIndex = this.profiles.findIndex(p => p.id === this.currentProfile.id);
            this.profiles[profileIndex] = this.currentProfile;
            this.saveProfilesToStorage();
            
            // Show result
            this.displayBMIResult(bmi, category);
            
            // Reset form and render history
            document.getElementById('bmi-form').reset();
            this.setDefaultDate();
            this.renderBMIHistory();
        } catch (error) {
            alert('Error calculating BMI: ' + error.message);
        }
    }

    displayBMIResult(bmi, category) {
        const resultDiv = document.getElementById('bmi-result');
        const valueDiv = document.getElementById('bmi-value');
        const categoryDiv = document.getElementById('bmi-category');
        
        valueDiv.textContent = bmi;
        categoryDiv.textContent = category;
        resultDiv.style.display = 'block';
        resultDiv.style.background = this.getBMICategoryColor(parseFloat(bmi));
        
        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    deleteBMIEntry(entryId) {
        if (confirm('Are you sure you want to delete this BMI entry?')) {
            this.currentProfile.bmiData = this.currentProfile.bmiData.filter(e => e.id !== entryId);
            
            const profileIndex = this.profiles.findIndex(p => p.id === this.currentProfile.id);
            this.profiles[profileIndex] = this.currentProfile;
            this.saveProfilesToStorage();
            
            this.renderBMIHistory();
        }
    }

    renderBMIHistory() {
        const container = document.getElementById('bmi-history-list');
        
        if (!this.currentProfile.bmiData || this.currentProfile.bmiData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No BMI records yet. Add your first entry above!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.currentProfile.bmiData.map(entry => `
            <div class="bmi-entry-item">
                <div class="bmi-entry-info">
                    <strong>BMI: ${entry.bmi}</strong> - ${entry.category}
                    <div class="bmi-entry-date">
                        📅 ${this.formatDate(entry.date)} | 
                        ⚖️ ${entry.weight}kg | 
                        📏 ${entry.height}cm
                    </div>
                </div>
                <button class="bmi-entry-delete" data-entry-id="${entry.id}">Delete</button>
            </div>
        `).join('');
        
        // Add event delegation for delete buttons
        container.querySelectorAll('.bmi-entry-delete').forEach(btn => {
            btn.addEventListener('click', () => this.deleteBMIEntry(parseInt(btn.dataset.entryId)));
        });
    }

    // Comparison Data
    showComparison() {
        if (!this.currentProfile || !this.currentProfile.bmiData.length) {
            alert('Please add at least one BMI entry to view comparison data.');
            return;
        }
        
        const modal = document.getElementById('comparison-modal');
        const content = document.getElementById('comparison-content');
        
        const latestBMI = this.currentProfile.bmiData[0];
        const averageData = this.getAverageBMIData(
            this.currentProfile.age,
            this.currentProfile.gender,
            this.currentProfile.ethnicity
        );
        
        content.innerHTML = `
            <div class="comparison-info">
                <h4>Your Current Data</h4>
                <p><strong>Name:</strong> ${this.currentProfile.name}</p>
                <p><strong>Age:</strong> ${this.currentProfile.age}</p>
                <p><strong>Gender:</strong> ${this.capitalize(this.currentProfile.gender)}</p>
                <p><strong>Ethnicity:</strong> ${this.capitalize(this.currentProfile.ethnicity)}</p>
                <p><strong>Latest BMI:</strong> ${latestBMI.bmi} (${latestBMI.category})</p>
            </div>
            
            <div class="comparison-info">
                <h4>Average BMI Data for Your Demographics</h4>
                <p>Based on age, gender, and ethnicity</p>
                
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>BMI Range</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateComparisonRows(latestBMI.bmi, averageData)}
                    </tbody>
                </table>
            </div>
            
            <div class="comparison-info">
                <h4>Health Information</h4>
                <p>${this.getHealthAdvice(latestBMI.bmi, this.currentProfile.age)}</p>
            </div>
            
            <div class="comparison-info">
                <h4>Helpful Resources</h4>
                <ul>
                    <li><a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer">WHO: Obesity and Overweight</a></li>
                    <li><a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer">CDC: About BMI</a></li>
                    <li><a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm" target="_blank" rel="noopener noreferrer">NHLBI: BMI Calculator</a></li>
                    <li><a href="https://www.heart.org/en/healthy-living/healthy-eating/losing-weight/bmi-in-adults" target="_blank" rel="noopener noreferrer">American Heart Association: BMI in Adults</a></li>
                </ul>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    getAverageBMIData(age, gender, ethnicity) {
        // Average BMI ranges based on demographics
        // Note: These are standard WHO ranges with simplified ethnicity adjustments
        // For medical decisions, please consult with a healthcare provider
        const { UNDERWEIGHT, NORMAL, OVERWEIGHT } = FamilyHealthTracker.BMI_THRESHOLDS;
        const baseRanges = {
            underweight: { min: 0, max: UNDERWEIGHT },
            normal: { min: UNDERWEIGHT, max: NORMAL },
            overweight: { min: NORMAL, max: OVERWEIGHT },
            obese: { min: OVERWEIGHT, max: 50 }
        };
        
        // Ethnicity-based adjustments (simplified)
        // Reference: WHO expert consultation (2004) on BMI for Asian populations
        // suggested lower cut-off points for public health action
        const ethnicityAdjustments = {
            asian: -2.5, // Approximate adjustment for Asian populations
            black: 0,
            white: 0,
            hispanic: 0,
            other: 0
        };
        
        const adjustment = ethnicityAdjustments[ethnicity] || 0;
        
        return {
            underweight: { 
                min: baseRanges.underweight.min, 
                max: baseRanges.underweight.max + adjustment 
            },
            normal: { 
                min: baseRanges.underweight.max + adjustment, 
                max: baseRanges.normal.max + adjustment 
            },
            overweight: { 
                min: baseRanges.normal.max + adjustment, 
                max: baseRanges.overweight.max + adjustment 
            },
            obese: { 
                min: baseRanges.overweight.max + adjustment, 
                max: baseRanges.obese.max 
            }
        };
    }

    generateComparisonRows(currentBMI, averageData) {
        const categories = [
            { name: 'Underweight', data: averageData.underweight },
            { name: 'Normal Weight', data: averageData.normal },
            { name: 'Overweight', data: averageData.overweight },
            { name: 'Obese', data: averageData.obese }
        ];
        
        return categories.map((cat, index) => {
            // For obese category, check only lower bound; for others, check range
            const isInRange = index === categories.length - 1 
                ? currentBMI >= cat.data.min 
                : currentBMI >= cat.data.min && currentBMI < cat.data.max;
            const rowClass = isInRange ? 'class="highlight"' : '';
            const status = isInRange ? '✓ Your Current Range' : '';
            
            return `
                <tr ${rowClass}>
                    <td>${cat.name}</td>
                    <td>${cat.data.min.toFixed(1)} - ${cat.data.max.toFixed(1)}</td>
                    <td>${status}</td>
                </tr>
            `;
        }).join('');
    }

    getHealthAdvice(bmi, age) {
        const { UNDERWEIGHT, NORMAL, OVERWEIGHT } = FamilyHealthTracker.BMI_THRESHOLDS;
        
        if (bmi < UNDERWEIGHT) {
            return `Your BMI indicates you are underweight. Consider consulting with a healthcare provider 
                    about healthy ways to gain weight. A balanced diet with adequate calories and regular 
                    strength training can help.`;
        } else if (bmi < NORMAL) {
            return `Your BMI is in the normal range! Maintain your healthy weight through a balanced diet 
                    and regular physical activity. Aim for at least 150 minutes of moderate aerobic activity 
                    per week.`;
        } else if (bmi < OVERWEIGHT) {
            return `Your BMI indicates you are overweight. Consider making lifestyle changes such as eating 
                    a balanced, calorie-controlled diet and increasing physical activity. Even a small weight 
                    loss of 5-10% can have significant health benefits.`;
        } else {
            return `Your BMI indicates obesity. It's recommended to consult with a healthcare provider for 
                    a comprehensive health assessment. They can help create a personalized plan for healthy 
                    weight loss through diet, exercise, and possibly other interventions.`;
        }
    }

    // Utility Functions
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateStr) {
        // Parse date string as local date to avoid timezone issues
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FamilyHealthTracker();
});
