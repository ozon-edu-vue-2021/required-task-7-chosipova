"use strict";

window.onload = function () {
  const contactListBlock = document.querySelector(".contacts-list"),
    contactContainer = document.querySelector("#container"),
    backButton = document.querySelector(".back"),
    detailsList = document.querySelectorAll(".details-view ul li span"),
    detailsCount = 3,
    contactTransform = 70;

  const popularContacts = (contactsArr) => {
    let allContactFriends = [];

    contactsArr.forEach((elem) => {
      allContactFriends = [...allContactFriends, ...elem.friends];
    });

    return contactsArr
      .map((contact) => {
        let count = allContactFriends.filter((x) => x === contact.id).length;
        return { id: contact.id, name: contact.name, count: count };
      })
      .sort((a, b) =>
        a.count !== b.count ? b.count - a.count : a.name.localeCompare(b.name)
      )
      .slice(0, detailsCount);
  };

  const getContactList = async function () {
    try {
      const response = await fetch("data.json");
      const contactListArray = await response.json();

      if (!response.ok) {
        throw new Error("Что-то пошло не так!");
      }

      contactListArray.forEach((contact, index) => {
        let contactListChild = document.createElement("li");
        contactListChild.textContent = contact.name;
        contactListBlock.appendChild(contactListChild);
        contactListChild.style.transform = `translate3d(0, ${
          contactTransform * index
        }px, 0)`;

        let contactFriends = contactListArray
          .filter((friend) => {
            return contact.friends.includes(friend.id);
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, detailsCount);

        let contactNotFriends = contactListArray
          .filter((friend) => {
            return !contact.friends.includes(friend.id);
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, detailsCount);

        popularContacts(contactListArray).forEach((person, index) => {
          detailsList[detailsList.length - 1 - index].textContent = person.name;
        });

        contactListChild.addEventListener("click", () => {
          contactContainer.classList.add("details");
          contactListChild.classList.add("active");
          contactListChild.style.transform = `translate3d(40px, 0, 0)`;
          [...contactFriends, ...contactNotFriends].forEach(
            (contact, index) => {
              detailsList[index].textContent = contact.name;
            }
          );
        });
      });
    } catch (e) {
      let errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Не удалось загрузить контакты.";
      contactContainer.appendChild(errorMessage);
    }
  };

  getContactList();

  backButton.addEventListener("click", () => {
    contactContainer.classList.remove("details");
    document.querySelectorAll(".contacts-list li").forEach((contact, index) => {
      contact.style.transform = `translate3d(0, ${
        contactTransform * index
      }px, 0)`;
      contact.classList.remove("active");
    });
  });
};
