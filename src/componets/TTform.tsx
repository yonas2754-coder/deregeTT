// components/TTFormV9.tsx
'use client'; 

import * as React from 'react';
import {
  Button,
  Field,
  Input,
  Textarea,
  Dropdown,
  Option,
  makeStyles,
  shorthands,
  tokens,
  useId,
  Label,
  RadioGroup,
  Radio,
  Title2,
  Spinner,
} from '@fluentui/react-components';

// --- CONFIGURATION DATA (i18n ready) ---
const classificationOptions = ['Provisioning', 'Maintenance', 'Others'];
const requestTypeOptions = ['Email', 'Phone', 'SMS order', 'Manual order'];
const zoneOptions = ['CAAZ', 'SAAZ', 'NAAZ', 'EAAZ', 'Enterprise office', 'WAAZ', 'SWAAZ', 'NR- Mekele', 'NEER - Semera', 'CNR - D. Birhan', 'SER - Adama', 'SR - Hawassa', 'WR - Nekempt', 'ER - Dire Dawa'];
const handlerOptions = ['Alegntaye', 'Yehualaeshet', 'semanu', 'Ermias', 'Abdulhafiz'];
const specificRequestOptions = [
    'Centrex group configuration(Hunting as PBX) (01)',
    'IMS SIP, GPON Combo service configuration (02)',
    'Online Support PSTN Migration, Incoming and Outgoing call solution, Caller Id Display, Routing for O&M, Enterprise & Others Stakeholders (06)',
    'Other tasks (Data collection, data checking, hundred group configuration, and routing, caller ID display, additional E1 No of range configuration) (07)',
    'Short code 3 and 4 Digits configuration for Fixed Number, ISDN SIP service and SMS orders closed (09)'
];
const priorityOptions = ['High', 'Medium', 'Low']; 


// --- STYLING (Professional Responsive Grid & Typography) ---
const useStyles = makeStyles({
  container: {
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXXL, tokens.spacingVerticalM, tokens.spacingHorizontalXXL),
    maxWidth: '1200px', 
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('28px'),

    '@media (max-width: 768px)': {
        ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalL, tokens.spacingVerticalM, tokens.spacingHorizontalL),
    },
  },
  title: {
    borderBottom: `2px solid ${tokens.colorBrandBackground}`, 
    paddingBottom: '8px', 
    marginBottom: '4px',
    // PROFESSIONAL TYPOGRAPHY: Ensure title is large and bold
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeHero700, 
  },
  
  formLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Desktop
    ...shorthands.gap('24px'), 
    
    '@media (max-width: 1200px)': {
        gridTemplateColumns: 'repeat(2, 1fr)', // Tablet
        ...shorthands.gap('20px'),
    },
    
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr', // Mobile
        ...shorthands.gap('16px'),
    },
  },
  
  fullWidth: {
    gridColumnStart: 1,
    gridColumnEnd: 4,
    '@media (max-width: 1200px)': {
        gridColumnEnd: 3, 
    },
    '@media (max-width: 768px)': {
        gridColumnEnd: 2, 
    },
  },

  submitButton: {
    marginTop: '10px',
    width: 'fit-content',
    // PROFESSIONAL TYPOGRAPHY: Ensure button text is clearly legible
    fontWeight: tokens.fontWeightSemibold, 
    // Mobile optimization: Make button full width
    '@media (max-width: 768px)': {
        width: '100%',
    },
  }
});

// --- FORM STATE & LOGIC ---
interface ITicketState {
  serviceNumber: string;
  tasksClassification: string;
  requestType: string;
  specificRequestType: string;
  zone: string;
  handler: string;
  remarks: string;
  priority: string;
}

const TTForm: React.FC = () => {
  const styles = useStyles();
  
  const resetTicket = React.useCallback(() => ({
    serviceNumber: '', tasksClassification: '', requestType: 'Email', specificRequestType: '', 
    zone: '', handler: '', remarks: '', priority: 'Medium' 
  }), []);
  
  const [ticket, setTicket] = React.useState<ITicketState>(resetTicket);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const serviceNumberId = useId('serviceNumber-input');

  const handleChange = (field: keyof ITicketState, value: string): void => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleDropdownSelect = (field: keyof ITicketState, option: string | undefined): void => {
    handleChange(field, option || '');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Submitting Trouble Ticket (V9):', ticket);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    setIsLoading(false);
    alert('Trouble Ticket Submitted Successfully!');
    setTicket(resetTicket());
  };

  const isFormInvalid = (
      !ticket.serviceNumber || 
      !ticket.tasksClassification || 
      !ticket.specificRequestType || 
      !ticket.zone || 
      !ticket.handler ||
      !ticket.remarks
  );

  return (
    <div className={styles.container}>
      <Title2 className={styles.title}>
        Ethio telecom Trouble Ticket Creation
      </Title2>
      <Label size="large" weight="semibold"> {/* Use semibold weight for instructions */}
        Mandatory fields are marked with an asterisk (*). Please ensure accuracy for efficient task handling.
      </Label>

      <form onSubmit={handleSubmit}>
        <div className={styles.formLayout}>
          
          {/* Service Number (Input) */}
          <Field 
            label="Service Number *" 
            required
            validationMessage={!ticket.serviceNumber && !isLoading ? 'Service Number is required.' : undefined}
          >
            <Input
              id={serviceNumberId}
              placeholder="e.g., 2519xxxxxx or E1 No"
              value={ticket.serviceNumber}
              onChange={(e) => handleChange('serviceNumber', e.target.value)}
              disabled={isLoading}
            />
          </Field>
          
          {/* Handler / Assigned Agent (Dropdown) */}
          <Field 
            label="Handler / Assigned Agent *" 
            required
          >
            <Dropdown
              placeholder="Select Handling Agent"
              selectedOptions={[ticket.handler]}
              onOptionSelect={(e, data) => handleDropdownSelect('handler', data.optionText)}
              disabled={isLoading}
            >
              {handlerOptions.map((option) => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Dropdown>
          </Field>

          {/* Priority (Active RadioGroup) */}
          <Field 
            label="Priority *"
            required
          >
             <RadioGroup
                layout="horizontal"
                value={ticket.priority}
                onChange={(_, data) => handleChange('priority', data.value)}
                disabled={isLoading}
             >
                {priorityOptions.map((level) => (
                    <Radio key={level} value={level} label={level} />
                ))}
            </RadioGroup>
          </Field>


          {/* Task Classification (Dropdown) */}
          <Field 
            label="Task Classification *" 
            required
          >
            <Dropdown
              placeholder="Select Task Category"
              selectedOptions={[ticket.tasksClassification]}
              onOptionSelect={(e, data) => handleDropdownSelect('tasksClassification', data.optionText)}
              disabled={isLoading}
            >
              {classificationOptions.map((option) => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Dropdown>
          </Field>
          
          {/* Zone/Region (Dropdown) */}
          <Field 
            label="Zone/Region *" 
            required
          >
            <Dropdown
              placeholder="Select Zone or Region"
              selectedOptions={[ticket.zone]}
              onOptionSelect={(e, data) => handleDropdownSelect('zone', data.optionText)}
              disabled={isLoading}
              aria-expanded
            >
              {zoneOptions.map((option) => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Dropdown>
          </Field>

          {/* Request Source (RadioGroup) */}
          <Field 
            label="Request Source/Type *" 
            required
          >
             <RadioGroup
                layout="horizontal"
                value={ticket.requestType}
                onChange={(_, data) => handleChange('requestType', data.value)}
                disabled={isLoading}
             >
                {requestTypeOptions.map((type) => (
                    <Radio key={type} value={type} label={type} />
                ))}
            </RadioGroup>
          </Field>
          

          {/* Specific Request Type (Full Width on all resolutions) */}
          <Field 
            className={styles.fullWidth} 
            label="Specific Request Type *" 
            required 
            hint="Select the specific code matching the required task."
          >
            <Dropdown
              placeholder="Select Specific Request Type and Code"
              selectedOptions={[ticket.specificRequestType]}
              onOptionSelect={(e, data) => handleDropdownSelect('specificRequestType', data.optionText)}
              disabled={isLoading}
              aria-expanded
            >
              {specificRequestOptions.map((option) => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Dropdown>
          </Field>

          {/* Remarks/Details (Full Width on all resolutions) */}
          <Field 
            className={styles.fullWidth} 
            label="Detailed Request Description / Remarks *" 
            required 
            hint="Provide context, required actions, and any customer contact information."
          >
            <Textarea
              resize="vertical"
              rows={5}
              placeholder="Start typing the details here..."
              value={ticket.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              disabled={isLoading}
            />
          </Field>

        </div>
        
        {/* Submit Button with Loading State */}
        <Button 
          className={styles.submitButton}
          type="submit" 
          appearance="primary" 
          size="large"
          disabled={isLoading || isFormInvalid}
        >
          {isLoading ? (
            <><Spinner size="tiny" /> Creating Ticket...</>
          ) : (
            'Create Trouble Ticket'
          )}
        </Button>
      </form>
    </div>
  );
};

export default TTForm;