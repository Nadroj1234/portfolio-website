
#!/bin/bash

#################################################
# CYBERPATRIOT LINUX MINT 21 SECURITY TOOLKIT
# Version: 1.0
# Purpose: Security auditing and basic hardening
#################################################

# Create a log directory
LOG_DIR="$HOME/cyberpatriot-logs"
mkdir -p "$LOG_DIR"

# Create a log file with the current date and time
LOG_FILE="$LOG_DIR/audit-$(date +%Y-%m-%d_%H-%M-%S).log"

# Display output and save it to the log
exec > >(tee -a "$LOG_FILE") 2>&1

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

#################################################
# HELPER FUNCTIONS
#################################################

pause() {
    echo ""
    read -rp "Press ENTER to continue..."
}

confirm() {
    local answer
    read -rp "$1 (yes/no): " answer
    [[ "$answer" == "yes" ]]
}

require_sudo() {
    if sudo -v; then
        return 0
    else
        echo -e "${RED}Administrator authentication failed.${NC}"
        return 1
    fi
}

header() {
    clear
    echo "=========================================="
    echo "       CYBERPATRIOT MINT 21 TOOLKIT"
    echo "=========================================="
    echo ""
}

#################################################
# SECURITY CHECKS
#################################################

check_system() {
    echo -e "${BLUE}[SYSTEM INFORMATION]${NC}"

    cat /etc/linuxmint/info 2>/dev/null || cat /etc/os-release

    echo ""
    echo "Kernel:"
    uname -r

    echo ""
    echo "Hostname:"
    hostname
}

check_users() {
    echo -e "${BLUE}[USER ACCOUNTS]${NC}"

    echo "Accounts with interactive login shells:"
    awk -F: '$7 !~ /(nologin|false)$/ {print $1 " - " $7}' /etc/passwd

    echo ""
    echo "Accounts with root privileges (UID 0):"
    awk -F: '$3 == 0 {print $1}' /etc/passwd

    echo ""
    echo "Members of the sudo group:"
    getent group sudo
}

check_firewall() {
    echo -e "${BLUE}[FIREWALL STATUS]${NC}"

    if command -v ufw >/dev/null 2>&1; then
        sudo ufw status verbose
    else
        echo -e "${YELLOW}UFW is not installed.${NC}"
    fi
}

check_updates() {
    echo -e "${BLUE}[AVAILABLE UPDATES]${NC}"

    sudo apt-get update

    echo ""
    apt list --upgradable 2>/dev/null
}

check_ports() {
    echo -e "${BLUE}[LISTENING NETWORK PORTS]${NC}"

    sudo ss -tulpn
}

check_services() {
    echo -e "${BLUE}[RUNNING SERVICES]${NC}"

    systemctl --type=service --state=running --no-pager
}

check_ssh() {
    echo -e "${BLUE}[SSH CONFIGURATION]${NC}"

    if command -v sshd >/dev/null 2>&1; then
        sudo sshd -T 2>/dev/null | grep -E \
        '^(permitrootlogin|passwordauthentication|pubkeyauthentication|permitemptypasswords)'
    else
        echo "SSH server is not installed."
    fi
}

#################################################
# FULL SECURITY AUDIT
#################################################

full_audit() {
    header

    echo "STARTING FULL SECURITY AUDIT"
    echo "Date: $(date)"
    echo ""

    check_system
    echo ""

    check_users
    echo ""

    check_firewall
    echo ""

    check_updates
    echo ""

    check_ports
    echo ""

    check_services
    echo ""

    check_ssh

    echo ""
    echo "=========================================="
    echo "AUDIT COMPLETE"
    echo "Log saved to: $LOG_FILE"
    echo "=========================================="

    pause
}

#################################################
# SECURITY FIXES
#################################################

enable_firewall() {
    header

    echo "FIREWALL HARDENING"
    echo ""
    echo "This will:"
    echo "1. Deny incoming connections by default."
    echo "2. Allow outgoing connections."
    echo "3. Enable the UFW firewall."
    echo ""
    echo -e "${YELLOW}Warning: This may affect network services.${NC}"
    echo ""

    if ! confirm "Do you want to continue?"; then
        echo "Operation cancelled."
        pause
        return
    fi

    if ! require_sudo; then
        pause
        return
    fi

    if ! command -v ufw >/dev/null 2>&1; then
        if confirm "UFW is missing. Install it?"; then
            sudo apt-get install ufw
        else
            echo "Firewall setup cancelled."
            pause
            return
        fi
    fi

    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw --force enable

    echo ""
    echo -e "${GREEN}Firewall configuration command completed.${NC}"
    sudo ufw status verbose

    pause
}

install_updates() {
    header

    echo "SYSTEM UPDATE"
    echo ""
    echo "This will install available package upgrades."
    echo "It may take several minutes."
    echo ""

    if confirm "Do you want to install updates?"; then
        if require_sudo; then
            sudo apt-get update
            sudo apt-get upgrade
        fi
    else
        echo "Update cancelled."
    fi

    pause
}

#################################################
# INDIVIDUAL CHECK MENU
#################################################

individual_checks() {
    while true; do
        header

        echo "INDIVIDUAL SECURITY CHECKS"
        echo ""
        echo "1. System information"
        echo "2. User accounts"
        echo "3. Firewall status"
        echo "4. Available updates"
        echo "5. Listening ports"
        echo "6. Running services"
        echo "7. SSH configuration"
        echo "8. Return to main menu"
        echo ""

        read -rp "Choose an option: " choice

        case "$choice" in
            1) check_system; pause ;;
            2) check_users; pause ;;
            3) check_firewall; pause ;;
            4) check_updates; pause ;;
            5) check_ports; pause ;;
            6) check_services; pause ;;
            7) check_ssh; pause ;;
            8) break ;;
            *) echo "Invalid option."; pause ;;
        esac
    done
}

#################################################
# HARDENING MENU
#################################################

hardening_menu() {
    while true; do
        header

        echo "SECURITY HARDENING"
        echo ""
        echo "1. Enable/configure firewall"
        echo "2. Install available updates"
        echo "3. Return to main menu"
        echo ""

        read -rp "Choose an option: " choice

        case "$choice" in
            1) enable_firewall ;;
            2) install_updates ;;
            3) break ;;
            *) echo "Invalid option."; pause ;;
        esac
    done
}

#################################################
# MAIN MENU
#################################################

main_menu() {
    while true; do
        header

        echo "1. Full security audit"
        echo "2. Individual security checks"
        echo "3. Security hardening"
        echo "4. Exit"
        echo ""

        read -rp "Select an option: " choice

        case "$choice" in
            1) full_audit ;;
            2) individual_checks ;;
            3) hardening_menu ;;
            4)
                echo ""
                echo "Exiting CyberPatriot Toolkit."
                echo "Log: $LOG_FILE"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid selection.${NC}"
                pause
                ;;
        esac
    done
}

#################################################
# START PROGRAM
#################################################

main_menu
